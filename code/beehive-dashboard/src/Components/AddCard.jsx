import Add from "../Assets/Add.png";
import Ellipse from "../Assets/Card_Ellipse.png";
import '../Styles/Components/AddCard.scss';

function AddCard() {
  return (
    <div className='add-card'>
      <img src={Ellipse} alt="" className="add-ellipse" />
      <div className="add-sign">
        <img src={Add} alt="" className="add-logo" />
      </div>
      <p className="add-text">Add New Beehive</p>
    </div>
  );
}

export default AddCard;
