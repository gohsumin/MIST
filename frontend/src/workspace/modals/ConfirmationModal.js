import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

function ConfirmationModal(props) {
    return (
        <Modal centered show={props.show} onHide={props.closePortal}>
            <Modal.Header closeButton>
                <Modal.Title>Warning! Confirmation Necessary</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                {props.warningMessage}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.closePortal}> Cancel </Button>
                    <Button variant="danger" onClick={props.confirmOnClick}>Confirm</Button>
                </Modal.Footer>
        </Modal>
    );
}

ConfirmationModal.propTypes = {
    confirmOnClickCallback: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    warningMessage: PropTypes.string.isRequired
}
export default ConfirmationModal;
