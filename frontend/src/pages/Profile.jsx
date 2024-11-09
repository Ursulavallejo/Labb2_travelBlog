import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';

export default function Register() {
  const { ID } = useContext(UserContext);

  const [loading, setLoad] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUser = () => {
      // if (!ID) return;
      console.log(ID);

      fetch(`users/${ID}`)
        .then((resp) => resp.json())
        .then((data) => {
          setProfile({
            fname: data.user.first_name,
            lname: data.user.last_name,
            phone: data.user.phone,
            username: data.user.username,
            email: data.user.email,
          });
          setLoad(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUser();
  }, [ID]);

  return (
    //////////// form to open and close user profile edit ////////
    <>
      {loading ? (
        <div
          style={{ width: '5rem', height: '5rem' }}
          className="spinner-border mx-auto my-auto"
          role="status"
        />
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center my-auto">
          <h2>Ändra dina uppgifter</h2>

          <div
            id="containerReg"
            className="d-flex rounded-5 p-5"
            style={{ background: '#0077B6' }}
          >
            <form
              id="register"
              className="d-flex flex-column mx-auto"
              action=""
            >
              <label htmlFor="fname" className="mt-3">
                Ange förnamn:
              </label>
              <input
                id="fname"
                name="fname"
                type="text"
                placeholder="Förnamn..."
                defaultValue={profile.fname}
                disabled
              />
              <label htmlFor="lname" className="mt-3">
                Ange efternamn:
              </label>
              <input
                id="lname"
                name="lname"
                type="text"
                placeholder="Efternamn..."
                defaultValue={profile.lname}
                disabled
              />
              <label htmlFor="username" className="mt-3">
                Ange användarenamn:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Andvändare namn..."
                defaultValue={profile.username}
                disabled
              />
              <label htmlFor="emailReg" className="mt-3">
                Ange email:
              </label>
              <input
                id="emailReg"
                name="emailReg"
                type="text"
                placeholder="Email..."
                defaultValue={profile.email}
                disabled
              />
              <button
                disabled
                type="submit"
                className="w-50 mx-auto mt-3 rounded-2"
              >
                Bekräfta uppdatering
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
