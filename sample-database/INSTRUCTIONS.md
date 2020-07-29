Instructions
============
These are instructions to restore the sample data we have made into your local database.

Steps
-------------
- If you have not already, download the mongoDB community server and compass (https://www.mongodb.com/try/download/community). 
- For Windows users only: Set the PATH to the mongo shell so you can run mongo commands from any location. 
    - First, locate where the mongo shell is located. The mongo shell is a file called “mongo.exe” or just “mongo”. If installed normally, it should be in a path similar to “C:\Program Files\MongoDB\Server\4.2\bin”, where 4.2 is the current version of mongo you have and the bin houses the mongo.exe file. 
    - Next, add this path to your PATH variables. A short description of how to add to the PATH: https://www.configserverfirewall.com/mongodb/install-mongodb-windows/#mongodb-windows-path. A detailed description of how to add to the PATH: https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/.
- For Mac users only: Check that when installing mongo, you followed these steps: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/. If you did not, do the steps that were missed. 
- For Linux users only:  Set the PATH to the mongo shell so you can run mongo commands from any location. 
    - First, locate where the mongo shell is located. To do this, find the MongoDB folder and the shell should follow a path similar to "\MongoDB\Server\4.2\bin". If you are not sure where MongoDB installed, check your distribution to see where programs are automatically downloaded to. 
    - Next, add this path to your PATH variables. A description of how to add to the PATH: https://www.baeldung.com/linux/path-variable. 
- Download the folder named dump if you do not have it.  
- Wherever you downloaded/moved the dump folder (if you cloned this repository, it will be inside the sample-database folder), open a terminal and run “mongorestore dump/”. If you get an error saying “the command is not recognized”, the PATH variable is not set correctly. If you get a print statement saying “0 documents restored”, check that you are in the right location (the location that contains the dump folder).
- Open compass and connect. You should see a usersDB database, which has example users, images, albums, comments, and challenges. If you had data in usersDB already, this will still be there too. 