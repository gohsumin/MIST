const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require("mongo-sanitize");
const bcrypt = require("bcrypt");

// why was this changed to acme??
mongoose.connect("mongodb://localhost:27017/usersDB", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // make connection to database or create it if it does not yet exist

mongoose.set("useFindAndModify", false);

// +---------+----------------------------------------------------------
// | Schemas |
// +---------+

const imagesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // of (of comment _ids)
  title: { type: String, required: true },
  code: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  createdAt: { type: String, default: Date.now },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ], // of (of flag_ids)
  public: Boolean, //true = public, false = private
  caption: String,
  featured: {
    type: Boolean,
    default: false,
  },
});

const commentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  body: String,
  createdAt: {
    type: String,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ], // of (of flag_ids)
});

const reportSchema = new mongoose.Schema({
  type: String, // type: Comment, Album, User, Image
  reportedId: mongoose.Schema.Types.ObjectId,
  body: String, // description of the offense, choosen from a list or given by user
  description: String, //optional description of why this was offensive
  count: Number, // count of how many times it has been flagged
  lastFlaggedAt: {
    // the most recent flag date
    type: Date,
    default: Date.now,
  },
  flaggedBy: [
    {
      //array of users(ids) who flagged it
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ] /*
  This could be useful for the future, if the moderators would like the id of 
  the user explitily. For now, the moderator, will have to search the appropirate collection
  for the given id and then check the user information
  flaggedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  } */,
});

const albumsSchema = new mongoose.Schema({
  name: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  images: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Image",
    },
  ], // (of Ids)
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  public: Boolean, // true = public, false = private
  active: Boolean,
  caption: String,
  flags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ], // of (of flag_ids)
});

const workspacesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  data: Object,
});

const usersSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, //hashed
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  verified: Boolean,
  admin: Boolean,
  moderator: Boolean,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // of image ids
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }], // of album ids
  workspaces: [workspacesSchema], // of workspace objects
  profilepic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  hidden: {
    commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    albumIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
    imageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  flags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ], // of (of flag_ids)
  liked: [{ type: mongoose.Schema.Types.ObjectId }], // of image _ids
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], //(of comment _ids)
  about: {
    String,
    default: "",
  },
  expertWorkspaces: [Object],
});

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)

  code: {
    type: String,
    require: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ], // of (of flag_ids)
  code: {
    type: String,
    require: true,
  }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)
  position: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

// Configuring Schemas
usersSchema.plugin(passportLocal);

// Models
const User = mongoose.model("User", usersSchema);
const Image = mongoose.model("Image", imagesSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Album = mongoose.model("Album", albumsSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const Workspace = mongoose.model("Workspace", workspacesSchema);
const Report = mongoose.model("Report", reportSchema);

// Export models
module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;
module.exports.Report = Report;

// Export Utilities
module.exports.Types = mongoose.Types;
module.exports.sanitize = sanitize; //sanitizes string

// +------------+-------------------------------------------------
// | Utitilites |
// +------------+

const Models = {
  Image: Image,
  Comment: Comment,
  Album: Album,
  Challenge: Challenge,
  Workspace: Workspace,
  Report: Report,
};

// everything after this is queries

// +------------+-------------------------------------------------
// |   Images   |
// +------------+

/**
 * checks whether the user owns an image with the same title
 * @param username the username of the user
 * @param title the title of the image
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */
module.exports.imageExists = (username, title, callback) => {
  User.findOne({ username: username })
    .populate("images")
    .exec((err, user) => {
      if (err) callback(err, null);
      else {
        let response = false;
        user.images.forEach((image) => {
          if (image.title === title) {
            response = true;
            return;
          }
        });
        callback(null, response);
      }
    });
};

/**
 * saves the new image in the database
 * @param userId the user._id of the user
 * @param title title of the image
 * @param code code for the image
 * @param res the response
 */
module.exports.saveImage = (userId, title, code, res) => {
  //build image
  let image = Image({
    userId: sanitize(userId),
    title: sanitize(title),
    code: sanitize(code),
    public: true,
    caption: "",
  });

  //save image
  image
    .save()
    .then((image) => {
      //push image to user's image array
      User.updateOne({ _id: userId }, { $push: { images: image._id } })
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert image into user's array");
          }
        })
        .catch((err) => {
          console.error(err);
          res.end(JSON.stringify(error));
        });
    })
    .catch((err) => {
      console.error(err);
      res.end(JSON.stringify(error));
    });
};

// +------------+-------------------------------------------------
// |   Gallery  |
// +------------+

/**
 * grab random images for logged out user
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error
 */
module.exports.getRandomImagesLoggedOut = (count, callback) => {
  Image.aggregate([
    { $match: { public: true, active: true } },
    { $sample: { size: count } },
  ]).exec((err, images) => {
    if (err) callback(null, err);
    else {
      Image.populate(images, { path: "userId" }, (err, images) => {
        if (err) callback(null, err);
        else callback(images, null);
      });
    }
  });
};

/**
 * grab recent images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error
 */
module.exports.getRecentImagesLoggedOut = (count, page, callback) => {
  Image.find({ public: true, active: true })
    .sort({ createdAt: -1 })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, null, err);
      else if (images.length <= count) {
        callback(images, false, err);
      } else {
        callback(images, true, err);
      }
    });
};

/**
 * grab featured images for logged out user
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error
 */
module.exports.getFeaturedImagesLoggedOut = (count, callback) => {
  Image.find({ featured: true, active: true })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, err);
      else {
        callback(images, null);
      }
    });
};

/**
 * grab top rated images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error
 */
module.exports.getTopRatedLoggedOut = (count, page, callback) => {
  Image.find({ public: true, active: true })
    .sort({ ratings: -1 })
    .limit(count)
    .populate("userId")
    .exec((err, images) => {
      if (err) callback(null, null, err);
      // might need to be null
      else if (images.length <= count) callback(images, false, err);
      else callback(images, true, err);
    });
};

// +----------------+-------------------------------------------------
// |   Challenges   |
// +----------------+

module.exports.getChallenges = (category, callback) => {
  Challenge.find({ category: category }, (err, challenges) => {
    if (err) callback(null, err);
    else callback(challenges, null);
  });
};

// +----------------+-------------------------------------------------
// |    Comments    |
// +----------------+

/**
 * saves the comment in the comments collection,
 * the user's comment array, and to image's comment array
 */
module.exports.saveComment = function (req, res) {
  // build the comment
  //let userID = req.user._id;
  let userID = req.body.userId;
  //let imageID = sanitize(req.params.imageid)
  let imageID = req.body.imageId;
  let comment = Comment({
    userId: userID,
    //body: sanitize(req.body.newComment),
    body: req.body.body,
    active: req.body.active,
    imageId: imageID,
    flags: req.body.flags,
  });

  //save comment
  comment
    .save()
    .then((comment) => {
      //push comment to user's comment array
      User.updateOne(
        { _id: mongoose.Types.ObjectId(userID) },
        { $push: { comments: comment._id } }
      )
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert comment into user's array");
          }
        })
        .catch((err) => {
          console.error(err);
          res.end(JSON.stringify(error));
        });
      //push comment to image's comment array
      Image.updateOne({ _id: imageID }, { $push: { comments: comment._id } })
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert comment into image's array");
          } else console.log("Inserted Comment");
        })
        .catch((err) => {
          console.error(err);
          res.end(JSON.stringify(error));
        });
      res.redirect("back");
    })
    .catch((err) => {
      console.error(err);
      res.end(JSON.stringify(error));
    });
};

//NOTE: This does not check if the comments are hidden from the user
// the commented out commentInfo does
/**
 * grab comment information
 * only returns active comments
 * @param imageid
 * @param callback
 */
module.exports.getComments = (imageid, callback) => {
  imageid = sanitize(imageid);

  // search the comments collection for documents that with imageid that match image._id
  Comment.find({
    imageId: mongoose.Types.ObjectId(imageid),
    active: true,
  })
    .populate("userId")
    .exec((err, comments) => {
      if (err) {
        console.log(err);
        callback(null, err);
      } else {
        callback(comments, null);
      }
    });
};

/**
 * grab comment information
 * returns active, un-hidden comments
 * @param userid
 * @param imageid
 * @param callback
 */
/*
module.exports.commentInfo = (userid, imageid, callback) => {
    imageid = sanitize(imageid);
    userid = sanitize(userid);
  
    module.exports.getHiddenAndBlockedIDs(userid, "comment", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, err)
      else {
        // how to return five at time? because rn we are returning all comments
        // username!!!!!
        // look into aggregation
        Comment.
          find({
            //exclude hidden comments and blocked users
            _id: { $nin: contentIds },
            userId: { $nin: blockedUsers },
            imageId: mongoose.Types.ObjectId(imageid),
            //include only active comments
            active: true,
          }).
          populate('userId').
          exec((err, comments) => {
            if (err) {
              console.log(err);
              callback(null, err);
            } else {
              callback(comments, null);
            }
          });
      }
    })
  };  
  */

// +------------+-------------------------------------------------
// |    Users   |
// +------------+

/**
 * Checks if the password is secure enough when the user is signing up
 */
passwordSecurity = (pass) => {
  let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let checkNumber = false;
  let checkSpecial = false;
  let Special = ["!", "@"];
  if (pass.length < 8) {
    return "Required: At least 8 characters";
  }
  for (let i = 0; i < Special.length; i++) {
    if (pass.includes(Special[i])) {
      checkSpecial = true;
    }
  }
  for (let i = 0; i < digits.length; i++) {
    if (pass.includes(digits[i])) {
      checkNumber = true;
    }
  }
  if (!checkSpecial) {
    return "Required: At least one special character";
  } else if (!checkNumber) {
    return "Required: At least one digit";
  } else {
    return "Success";
  }
};
/**
 * 
 * @param {*} req 
 * @param {*} callback 
 * Changes the password of the user
 */
module.exports.changePassword = async (req, callback) => {
  let dbPassword = "";
  await User.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      console.log("No doc");
      console.log(err);
    }
    dbPassword = doc.password;
  });
  bcrypt.compare(req.body.currentPassword, dbPassword, async (err, result) => {
    if (err) {
      callback(err);
    }
    if (result === false) {
      callback("Old Password Does Not Match");
    } else {
      if (passwordSecurity(req.body.newPassword) !== "Success") {
        callback(passwordSecurity(req.body.newPassword));
      } else {
        let newPass = await bcrypt.hash(req.body.newPassword, 12);
        User.findOneAndUpdate(
          { _id: req.body._id },
          { $set: { password: newPass} },
          { new: true },
          (err, doc) => {
            if (err) {
              callback(err);
            } else {
              callback("Successfully Updated Password");
            }
          }
        );
      }
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} callback
 * Chnages the email of the user in the database
 */
module.exports.changeEmail = (req, callback) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { email: req.body.newEmail } },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Email");
      }
    }
  );
};

/**
 *
 * @param {*} req
 * @param {*} callback
 * Changes the username of the user in the database
 */
module.exports.changeUsername = (req, callback) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { username: req.body.newUsername } },
    { new: true },
    (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback("Successfully Updated Username");
      }
    }
  );
};

// given a userId, returns the username
module.exports.getUsername = (userId, callback) => {
  User.findById(userId).exec((err, user) => {
    if (err) callback(null, err);
    else callback(user.username, null);
  });
};

/**
 * Deletes the user's account
 * @param {*} req 
 * @param {*} callback 
 */

module.exports.deleteAccount = async (req, callback) => {
  let dbPassword = "";
  await User.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    dbPassword = doc.password;
  })
  bcrypt.compare(req.body.currentPassword, dbPassword, (err, result) => {
    if (err) {
      callback(err);
    }
    if (result === false) {
      callback("Old Password Does Not Match");
    } else {
      User.findOneAndDelete({_id: req.body._id}, (err, doc) => {
        if(err) {
          callback(err)
        } else {
          callback("Deleted. Please Sign Out.")
        }
      })
    }
  })
}


/**
 * creates a new user in the database
 * @param req the request, must contain a user object
 * with username, firstname, lastname, username, password, and email
 * @param callback returns if the user exists already or if the user was created succesfully
 */
module.exports.createUser = (req, callback) => {
  let user = req.body;
  User.findOne({ username: user.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) callback("User Already Exists");
    if (!doc) {
      let passwordMessage = passwordSecurity(user.password);
      if (passwordMessage !== "Success") {
        callback(passwordMessage);
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
          forename: user.firstname,
          surname: user.lastname,
          username: user.username,
          password: hashedPassword,
          email: user.email,
          verified: true,
          admin: false,
          moderator: false,
        });
        await newUser.save();
        callback("User Created");
      }
    }
  });
};

// given a username, returns the userId
module.exports.getUserIdByUsername = (username, callback) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return callback(err, null);
    else return callback(null, user._id);
  });
};

// Returns all images and albums for a user
module.exports.getCompleteUserProfile = async (userid) => {
  userid = sanitize(userid);
  return (User
    .findById(userid)
    .populate({
      path: 'images',
      match: { active: true },
    })
    .populate({
      path: 'albums',
      match: { active: true }
    })
    .select('-password')
    .exec())
  //     .select('images albums')
};

// +--------------+-------------------------------------------------
// |    Expert    |
// +--------------+

/*
 * Check if the user corresponding to userId has an expertWorkspace with the
 * name of expertWorkspaceName.
 *
 * If user is sucessfully identified returns
 * {
 *  success: true,
 *  hasWorkspace: ...,
 * }
 * where hasWorkspace is true if the user has an expertWorksapce with the name
 * expertWorkspaceName otherwise false.
 *
 * If user is not successfully identified, returns
 * {
 *  sucess: false,
 *  message: ...,
 * }
 * where message is the message is our error message.
 */
module.exports.userHasWorkspace = (userId, expertWorkspaceName, res) => {
  const handleSuccess = (user) => {
    if (!user) {
      res.send({
        success: false,
        message: "User could not be located in the database",
      });
    } else {
      if (!user.expertWorkspaces) {
        res.send({
          success: true,
          hasWorkspace: false,
        });
      } else {
        let match = false;
        user.expertWorkspaces.forEach((expertWorkspace) => {
          if (expertWorkspace.name === expertWorkspaceName) {
            match = true;
            return;
          }
        });
        // if no workpace is matched
        res.send({
          success: true,
          hasWorkspace: match,
        });
      }
    }
  };
  const handleError = (error) => {
    res.status(400).send({
      success: false,
      message: "Failed to check due to " + error,
    });
  };
  User.findById(userId)
    .select("expertWorkspaces")
    .exec((error, user) => {
      if (error) handleError(error);
      else handleSuccess(user);
    });
};

/*
 * saves an expert workspace following the suggestion in the link below
 * https://stackoverflow.com/questions/32549326/mongoose-push-or-replace-element-into-array
 *
 * If successful, returns
 * {
 *  success: true
 * }
 *
 * Otherwise, returns
 * {
 *  success: false,
 *  message: ....
 * }
 * where message, is our error message
 *
 */
module.exports.saveExpertWorkspace = (userId, workspace, res) => {
  var bulk = User.collection.initializeOrderedBulkOp();

  bulk
    .find({
      _id: mongoose.Types.ObjectId(userId),
      "expertWorkspaces.name": workspace.name,
    })
    .updateOne({
      $set: { "expertWorkspaces.$": workspace },
    });

  bulk
    .find({
      _id: mongoose.Types.ObjectId(userId),
      "expertWorkspaces.name": { $ne: workspace.name },
    })
    .updateOne({
      $push: { expertWorkspaces: workspace },
    });
  bulk.execute((error, result) => {
    if (error) {
      res.status(400).send({
        success: false,
        message:
          "Error failed to save expert-workspace because of Error: " + error,
      });
    } else {
      if (result.nMatched === 0) {
        // chose nMatched because somehow Mongo was choosing
        // to not modify a document and array if the object inserted
        // is not different from what was already in the array.
        // so we assume that when we have a match the update
        // worked successfully
        res.json({
          success: false,
          message: "Error: Unknown",
        });
      } else {
        res.json({
          success: true,
        });
      }
    }
  });
};

/*
 * deletes an expert workspace
 *
 * If successful, returns
 * {
 *  success: true
 * }
 *
 * Otherwise, returns
 * {
 *  success: false,
 *  message: ....
 * }
 * where message, is our error message
 *
 */
module.exports.deleteexpertws = (userId, workspace_name, res) => {
  User.find({ _id: mongoose.Types.ObjectId(userId) })
    .updateOne({
      $pull: { expertWorkspaces: { name: workspace_name } },
    })
    .exec((error, result) => {
      if (error) {
        res.status(400).send({
          success: false,
          message:
            "Error failed to remove expert-workspace because of Error: " +
            error,
        });
      } else {
        if (result.nMatched === 0) {
          res.json({
            success: false,
            message: "Error: Unknown",
          });
        } else {
          res.json({
            success: true,
          });
        }
      }
    });
};

module.exports.getUserExpertWS = (userId, res) => {
  User.findById(userId)
    .select("expertWorkspaces")
    .exec()
    .then((user) => {
      if (user) return user.expertWorkspaces;
      else {
        res.json({
          success: false,
          message: "user could not be located in the database",
        });
      }
    })
    .then((expertWorkspaces) => {
      res.send({ success: true, expertWorkspaces: expertWorkspaces });
    })
    .catch((error) =>
      res.json({ success: false, message: "Failed due to Error: " + error })
    );
};

// +-----------+-------------------------------------------------
// | Workspace |
// +-----------+
module.exports.savews = (userId, workspace) =>
  User.bulkWrite(
    [
      {
        updateOne: {
          filter: {
            _id: mongoose.Types.ObjectId(userId),
            "workspaces.name": workspace.name,
          },
          update: { "workspaces.$.data": workspace.data },
        },
      },
      {
        updateOne: {
          filter: {
            _id: mongoose.Types.ObjectId(userId),
            "workspaces.name": { $ne: workspace.name },
          },
          update: { $push: { workspaces: new Workspace(workspace) } },
        },
      },
    ],
    { ordered: true }
  );

/**
 * Retrieves the workspaces corresponding to userid
 * We assume that userid corresponds to a user existing in the database
 */
module.exports.getws = async (userid) =>
  User.findById(userid).select("workspaces.data workspaces.name").exec();

/**
 * Checks if the user corresponding to userid has a workspace by the
 * name wsname. We assume that userid corresponds to an existing and active
 * user in the database
 *
 */
module.exports.wsexists = async (userid, wsname) =>
  User.findOne({
    _id: mongoose.Types.ObjectId(userid),
    "workspaces.name": wsname,
  })
    .countDocuments()
    .exec();

module.exports.deletews = async (userId, workspace_name) => (
  User.findOne({ _id: mongoose.Types.ObjectId(userId) })
    .updateOne({
      $pull: { workspaces: { name: workspace_name } },
    })
    .exec()
)

// +--------+----------------------------------------------------------
// | Albums |
// +--------+

// create Album
module.exports.createAlbum = async (userid, name) => {
  userid = sanitize(userid);
  name = sanitize(name);
  let album = new Album({
    name: name,
    userId: userid,
    public: false,
    active: true,
    flag: false,
    caption: '',
  }) // create album document object 
  try {
    //save the album object
    const albumObject = await album.save();
    if (albumObject) {
      return (
        User
          .updateOne({ _id: userid }, { $push: { albums: albumObject._id } })
          .exec()
      );
    } else {
      throw 'Failed to safe for Unkown reason'
    }
  } catch (error) {
    throw err;
  }
}; // createAlbum
