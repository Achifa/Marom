import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

function Modal({ show, onHide, title, children }) {
    return (
        <BootstrapModal show={show} onHide={onHide}
        >
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>{children}</BootstrapModal.Body>
        </BootstrapModal>
    );
}

export default Modal;
