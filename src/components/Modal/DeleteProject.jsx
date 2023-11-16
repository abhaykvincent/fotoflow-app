import React, { useState } from 'react';

function DeleteConfirmationModal({ onDeleteConfirm, onClose}) {
  const handleDelete = () => {
    // Call the delete function upon confirmation
    onDeleteConfirm();
    onClose();
  };

  return (
    <div className="modal-container">
      <div className="modal delete-project">
        <div className='modal-header'>
          <div className="modal-controls">
            <div className="control close" onClick={onClose}></div>
          </div>
          <div className="modal-title">Confirm Deletion</div>
        </div>
        <div className='modal-body'>
          <h4 className='message'>Are you sure you want to delete this project?</h4>
          <p className='note'><strong>Note:</strong> This action is permanent and will result in the loss of all associated data.</p>
        </div>
        <div className="actions">
          <div className="button secondary" onClick={onClose}>Cancel</div>
          <div className="button primary" onClick={handleDelete}>Delete</div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default DeleteConfirmationModal;
