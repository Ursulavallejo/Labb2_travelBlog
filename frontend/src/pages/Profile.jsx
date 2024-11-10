import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import { FaEdit } from 'react-icons/fa';

export default function Register() {
  const { ID } = useContext(UserContext);

  const [loading, setLoad] = useState(true);
  const [isEnabled, setEnabled] = useState(true);
  const [profile, setProfile] = useState({});

  // PATCH form for editing user details
  function editForm(e) {
    e.preventDefault();

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const username = document.getElementById('username');
    const email = document.getElementById('emailEdit');
    const phone = document.getElementById('phoneEdit');

    fetch(`/users/edit/${ID}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        first_name: fname.value,
        last_name: lname.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
      }),
    })
      .then((resp) => resp.json())
      .then(() => {
        alert('Ändrat uppgifter!');
        document.getElementById('edit').reset();
        setLoad(true);
      })
      .catch((err) => {
        console.error(err);
        alert('Något gick fel!');
      });
  }

  // initial GET by user id to display user details
  useEffect(() => {
    const fetchUser = () => {
      if (!ID) return;
      console.log(ID);

      fetch(`users/${ID}`)
        .then((resp) => resp.json())
        .then((data) => {
          setProfile({
            fname: data.user.first_name,
            lname: data.user.last_name,
            username: data.user.username,
            phone: data.user.phone,
            email: data.user.email,
          });
          setLoad(false);
          cancel();
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUser();
  }, [ID, loading]);

  function edit() {
    setEnabled(false);
    let inputs = document.querySelectorAll('.editInput');
    inputs.forEach((input) => {
      input.disabled = false;
    });
  }

  function cancel() {
    setEnabled(true);
    let inputs = document.querySelectorAll('.editInput');
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }

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
            className="d-flex flex-column rounded-5 p-3 profile-container"
            style={{ background: '#0077B6' }}
          >
            <div className="align-self-end editProfile" onClick={edit}>
              <FaEdit className="fs-3" />
            </div>
            <form
              id="edit"
              className="d-flex flex-column mx-auto "
              onSubmit={editForm}
            >
              <label htmlFor="fname" className="mt-3">
                Ange förnamn:
              </label>
              <input
                className="editInput"
                id="fname"
                name="fname"
                type="text"
                placeholder="Förnamn..."
                defaultValue={profile.fname}
                disabled
                required
              />
              <label htmlFor="lname" className="mt-3">
                Ange efternamn:
              </label>
              <input
                className="editInput"
                id="lname"
                name="lname"
                type="text"
                placeholder="Efternamn..."
                defaultValue={profile.lname}
                disabled
                required
              />
              <label htmlFor="username" className="mt-3">
                Ange användarenamn:
              </label>
              <input
                className="editInput"
                id="username"
                name="username"
                type="text"
                placeholder="Andvändare namn..."
                defaultValue={profile.username}
                disabled
                required
              />
              <label htmlFor="emailEdit" className="mt-3">
                Ange email:
              </label>
              <input
                className="editInput"
                id="emailEdit"
                name="emailEdit"
                type="text"
                placeholder="Email..."
                defaultValue={profile.email}
                disabled
                required
              />
              <label htmlFor="phoneEdit" className="mt-3">
                Ange telefonnr:
              </label>
              <input
                className="editInput"
                id="phoneEdit"
                name="phoneEdit"
                type="tel"
                placeholder="0700000000"
                defaultValue={profile.phone}
                disabled
                required
              />
              <div>
                <button
                  disabled={isEnabled}
                  type="submit"
                  className="w-50 mx-auto mt-3 rounded-2 editInput"
                >
                  Bekräfta
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={isEnabled}
                  className="w-50 mx-auto mt-3 rounded-2 editInput"
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
