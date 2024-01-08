"use client"

import React, {useState} from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function ModalComponent({handleClose, show}) {
  return (
    <Modal show={show} onHide={handleClose} className='modalContainer'>
        <Modal.Header className='modalHeader'>
          <Modal.Title>Modificar Nombre y Apellido</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          <div className='modalInputsContainer'>
            <input placeholder='Nombre' type='text'/>
            <input placeholder='Apellido' type='text'/>
          </div>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          <Button className='closeModalBtn' onClick={handleClose}>
            Cerrar
          </Button>
          <Button className='updateModalBtn' onClick={handleClose}>
            Modificar
          </Button>
        </Modal.Footer>
      </Modal>
  )
}
