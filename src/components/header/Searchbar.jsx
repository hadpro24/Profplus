import {useState, useEffect} from "react";
import "./seach.css";
// import { prof } from "../card-list/prof";
import Card from "../card-list/Card";
import {db} from '../../firebaseConfig';
import { useParams } from "react-router";

function Searchbar(props){
  /* State declarations part */
  const [prof, setProf] = useState([]);
  const readValue = ()=>{
    const data = localStorage.getItem('research');
    if(data) {
      setPro(JSON.parse(data));
    }
    else {
      console.log("vide");
    }
  }
  const ref = db.collection("prof");
  const items = [];
  const item = [];
  let { undefined } = props.matiere;
  const [pro, setPro] = useState({
    mat : "",
    lieu: "",
    niveau : "",
    isfilter: false,
  });
  const [location, setLocation] = useState(undefined);

  /* State declarations part */
  useEffect(() => {
      location ? getProfFilter() : getProf();
      readValue();
  }, []);
  //recuperer all prof information
  function getProf() {
    ref.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setProf(items);
    });
  }
  //Filtre des professeurs par commune
  function getProfFilter() {
    ref
      .where("commune", "==", `${location.slice(1, location.length)}`)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          item.push(doc.data());
        });
        setProf(item);
      });
  }
  //remove commune filter fonction
  const removeFilter=()=>{
    console.log("got clicked");
  }
  //detecter le changement des valeurs dans les inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPro((prevProf) => {
      return {
        ...prevProf,
        [name]: value,
        isfilter: true,
      };
    });
  };

  let compte = 0;
  const { mat,lieu,niveau } = pro;
  const filterAp = prof.filter((pr) => (pr.matiere.includes(mat)) & (pr.commune.includes(lieu)) & (pr.niveau.includes(niveau), compte++));

  /* SearchBar Componenets part */
  return (
    <div>
      <div className="search-box">
        <div className="search">
          <i className="fas fa-book"></i>
          <input
            name="mat"
            value={pro.mat}
            type="text"
            placeholder="Matiere"
            onChange={handleChange}
          ></input>
        </div>
        <div className="search">
          <i className="fas fa-map-marker-alt"></i>
          <input
            name="lieu"
            type="text"
            placeholder="Lieu"
            onChange={handleChange}
            value={pro.lieu}
          ></input>
        </div>
        <div className="search">
          <i className="fas fa-graduation-cap"></i>
          <input
            name="niveau"
            type="text"
            placeholder="niveau"
            onChange={handleChange}
            value={pro.niveau}
          ></input>
        </div>
        <button>Rechercher</button>
      </div>
      <div className="barreV"></div>
      <div className="card__section">
        <p className="person">
          {compte} Personnes <span>Trouvées</span>
        </p>
        <div className="filterAdd">
          {location && (
            <span>
              {location && location.slice(1, location.length)}
              <i onClick={removeFilter}  className="fas fa-times"></i>
            </span>
          )}
        </div>
        <div className="loading">
          <i 
            className={`fas fa-circle-notch fa-2x loading__circle__active ${
              prof.length != 0 ? " loading__circle" : " "
            }`}
          ></i>
          {pro.isfilter && prof.length != 0 ? (
            <Card prof={filterAp} />
          ) : (
            <Card prof={prof} />
          )}
        </div>
      </div>
    </div>
  );
}
export default Searchbar;
