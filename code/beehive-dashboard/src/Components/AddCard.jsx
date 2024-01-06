import Add from "../Assets/Add.png";
import Ellipse from "../Assets/Card_Ellipse.png";
import React, { useState } from 'react';
import '../Styles/Components/AddCard.scss';
import '../Styles/Components/AddBeehive.scss';

function AddCard() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };

  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  return (
    <div>
      <div className='add-card'>
        <img src={Ellipse} alt="" className="add-ellipse" />
        <div className="add-sign" onClick={toggleModal}>
          <img src={Add} alt="" className="add-logo" />
        </div>
        <p className="add-text">Add New Beehive</p>
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Add a new beehive</h2>
            <form onSubmit={handleSubmit}>
              <div className="hive-inputs">
                <div className="hive-input">
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="hive-input">
                  <input
                    type="text"
                    id="location"
                    placeholder="Location"
                    required
                  />
                </div>
              </div>
              <div className="submit-button">
                <button type="submit">SUBMIT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCard;
