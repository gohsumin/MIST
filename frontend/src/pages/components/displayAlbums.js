// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect, Component, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Carousel, Container, Col, Row } from "react-bootstrap";
import MISTImage from "./MISTImageGallery"
import {UserContext} from './Contexts/UserContext';

import "../../design/styleSheets/profile.css";
import "../../design/styleSheets/generalStyles.css";
import "bootstrap/dist/css/bootstrap.css";
/* icons */
import {
  SaveIcon,
  MoreIcon,
  PrivacyIcon,
  DeleteAlbumIcon
} from "./icons.js"

// +-------------------+----------------------------------------------------------------------
// | displayAlbums.js  |
// +-------------------+
/** Displays albums view when Albums is called
 */
function DisplayAlbums() {
    const [images, setImages] = useState("");
    const [modalShow, setModalShow] = React.useState(false);
    const user = useContext(UserContext);
    return (
        <Row style={{ justifyContent: "space-between" }}>
          {console.log(user)}
          {user.albums.map((album, index) => (
            <Card
              style={{ width: "31%", marginTop: "1em", marginBottom: "1em" }}s
            >
              <Card.Header>
                {/* Privacy Icon + Title + MoreIcon */}
                <Card.Title style={{ margin: "auto" }} className='linkItem'>
                  <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Col>
                      <PrivacyIcon />
                    </Col>
                    <Col>
                      <Link to={{ pathname: `/profile/${album._id}` }} className="link" style={{ color: "black" }}>
                        {album.name}
                      </Link>
                    </Col>
                    <MoreIcon />
                  </Row>
                </Card.Title>
  
                {/* Carousel + Description + date */}
                <Card.Body style={{ justifyContent: "space-between" }}>
                  <AlbumCarousel album={album} />
                  <p>{album.caption}</p>
                  <p>{new Date(parseInt(album.updatedAt)).toString()}</p>
                </Card.Body>
              </Card.Header>
            </Card>
          ))}
        </Row>
    )
  }
  
  /* returns carousel used for looking through album images, or an add image button if the album is empty
   * props: album
   */
  function AlbumCarousel(props) {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    return (
      /* If album is NOT empty, show a carousel */
      (props.album.images.length != 0) ?
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {props.album.images.map(image => (
            <Carousel.Item >
              <Row style={{ justifyContent: "center" }}>
                {/* Link to open album by clicking on the image */}
                <Link to={{ pathname: `/profile/${props.album._id}` }} className="link">
                  <MISTImage
                    code={image.code}
                    resolution="250"
                  />
                </Link>
              </Row>
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        :
        /* Else; if album is empty, show an "add images" button as big as a MIST image */
        <Button variant="light" style={{ minWidth: "100%", height: "250px" }}>
          Add Images
        </Button>
    )
  }
  export {DisplayAlbums}