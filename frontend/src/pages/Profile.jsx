import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { Button, Spinner, Form, Container } from 'react-bootstrap';
import backgroundImage from '../assets/images/istockphoto-1071294112-612x612.jpg';
import { FaEdit } from 'react-icons/fa';

export default function Profile() {
  const { ID } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setEnabled] = useState(true);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  // PATCH form for editing user details
  function editForm(e) {
    e.preventDefault();

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const username = document.getElementById('username');
    const email = document.getElementById('emailEdit');

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
      }),
    })
      .then((resp) => resp.json())
      .then(() => {
        alert('Profiluppgifter uppdaterade!');
        document.getElementById('edit').reset();
        setLoading(true);
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
      fetch(`users/${ID}`)
        .then((resp) => resp.json())
        .then((data) => {
          setProfile({
            fname: data.user.first_name,
            lname: data.user.last_name,
            username: data.user.username,
            email: data.user.email,
          });
          setLoading(false);
          cancel();
        })
        .catch((err) => console.error(err));
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

  const handleConfirm = () => {
    // alert('Profiluppgifter uppdaterade!');
    navigate('/blogs');
  };

  // const handleCancel = () => {
  //   navigate('/blogs');
  // };

  return (
    <div
      className="background-image-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="background-blur-overlay" />

      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center min-vh-100"
        style={{ position: 'relative', zIndex: 2 }}
      >
        {loading ? (
          <Spinner
            animation="border"
            role="status"
            style={{ width: '5rem', height: '5rem' }}
            className="mx-auto my-auto"
          />
        ) : (
          <>
            <h2 style={{ color: 'white', textAlign: 'center' }}>
              Ändra dina uppgifter
            </h2>
            <div
              id="containerReg"
              className="rounded-5 px-4 py-2"
              style={{ backgroundColor: '#123456' }}
            >
              <Form
                id="edit"
                onSubmit={editForm}
                className="d-flex flex-column mx-auto"
              >
                <FaEdit
                  onClick={edit}
                  className="fs-1 align-self-end"
                  style={{ color: 'white', cursor: 'pointer' }}
                />
                <Form.Group className="mt-3">
                  <Form.Label className="white-label">Ange förnamn:</Form.Label>
                  <Form.Control
                    id="fname"
                    className="editInput"
                    type="text"
                    placeholder="Förnamn..."
                    defaultValue={profile.fname}
                    disabled
                    style={{ color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label className="white-label">
                    Ange efternamn:
                  </Form.Label>
                  <Form.Control
                    id="lname"
                    className="editInput"
                    type="text"
                    placeholder="Efternamn..."
                    defaultValue={profile.lname}
                    disabled
                    style={{ color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label className="white-label">
                    Ange användarnamn:
                  </Form.Label>
                  <Form.Control
                    id="username"
                    className="editInput"
                    type="text"
                    placeholder="Användarnamn..."
                    defaultValue={profile.username}
                    disabled
                    style={{ color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label className="white-label">Ange email:</Form.Label>
                  <Form.Control
                    id="emailEdit"
                    className="editInput"
                    type="text"
                    placeholder="Email..."
                    defaultValue={profile.email}
                    disabled
                    style={{ color: '#123456' }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="warning"
                    className="w-50 mx-2 editInput"
                    // onClick={handleConfirm}
                    type="submit"
                  >
                    Bekräfta uppdatering
                  </Button>
                  <Button
                    variant="outline-warning"
                    className="w-50 mx-2"
                    onClick={cancel}
                    disabled={isEnabled}
                  >
                    Avbryt
                  </Button>
                </div>
              </Form>
              <Button
                variant="outline-warning"
                className="w-50 mx-auto d-flex mt-4"
                onClick={handleConfirm}
              >
                Tillbaka till Blogs
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
