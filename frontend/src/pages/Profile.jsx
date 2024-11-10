import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function Profile() {
  const { ID } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      if (!ID) return;
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
          setLoading(false);
        })
        .catch((err) => console.error(err));
    };
    fetchUser();
  }, [ID]);

  const handleConfirm = () => {
    alert('Profiluppgifter uppdaterade!');
    navigate('/blogs');
  };

  const handleCancel = () => {
    navigate('/blogs');
  };

  return (
    <>
      {loading ? (
        <div
          style={{ width: '5rem', height: '5rem' }}
          className="spinner-border mx-auto my-auto"
          role="status"
        />
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center my-auto">
          <h2 style={{ color: 'white' }}>Ändra dina uppgifter</h2>

          <div
            id="containerReg"
            className="profile-container rounded-5 p-5"
            style={{ backgroundColor: '#123456' }}
          >
            <form id="register" className="d-flex flex-column mx-auto">
              <label
                htmlFor="fname"
                className="mt-3"
                style={{ color: 'white' }}
              >
                Ange förnamn:
              </label>
              <input
                id="fname"
                name="fname"
                type="text"
                placeholder="Förnamn..."
                defaultValue={profile.fname}
                disabled
                style={{ backgroundColor: 'white', color: '#123456' }}
              />
              <label
                htmlFor="lname"
                className="mt-3"
                style={{ color: 'white' }}
              >
                Ange efternamn:
              </label>
              <input
                id="lname"
                name="lname"
                type="text"
                placeholder="Efternamn..."
                defaultValue={profile.lname}
                disabled
                style={{ backgroundColor: 'white', color: '#123456' }}
              />
              <label
                htmlFor="username"
                className="mt-3"
                style={{ color: 'white' }}
              >
                Ange användarenamn:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Användarnamn..."
                defaultValue={profile.username}
                disabled
                style={{ backgroundColor: 'white', color: '#123456' }}
              />
              <label
                htmlFor="emailReg"
                className="mt-3"
                style={{ color: 'white' }}
              >
                Ange email:
              </label>
              <input
                id="emailReg"
                name="emailReg"
                type="text"
                placeholder="Email..."
                defaultValue={profile.email}
                disabled
                style={{ backgroundColor: 'white', color: '#123456' }}
              />

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-50 mt-3 rounded-2 blue"
                  style={{
                    backgroundColor: '#e27e0a',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Bekräfta uppdatering
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-50 mt-3 rounded-2 blue ms-3"
                  style={{
                    color: '#e27e0a',
                    border: '1px solid #e27e0a',
                  }}
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
