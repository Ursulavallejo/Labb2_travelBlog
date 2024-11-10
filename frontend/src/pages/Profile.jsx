import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { Button, Spinner, Form, Container } from 'react-bootstrap';
import backgroundImage from '../assets/images/istockphoto-1071294112-612x612.jpg';

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
              className="rounded-5 p-5"
              style={{ backgroundColor: '#123456' }}
            >
              <Form className="d-flex flex-column mx-auto">
                <Form.Group className="mt-3">
                  <Form.Label>Ange förnamn:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Förnamn..."
                    defaultValue={profile.fname}
                    disabled
                    style={{ backgroundColor: 'white', color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Ange efternamn:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Efternamn..."
                    defaultValue={profile.lname}
                    disabled
                    style={{ backgroundColor: 'white', color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Ange användarnamn:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Användarnamn..."
                    defaultValue={profile.username}
                    disabled
                    style={{ backgroundColor: 'white', color: '#123456' }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Ange email:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email..."
                    defaultValue={profile.email}
                    disabled
                    style={{ backgroundColor: 'white', color: '#123456' }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="warning"
                    className="w-50 mx-2"
                    onClick={handleConfirm}
                  >
                    Bekräfta uppdatering
                  </Button>
                  <Button
                    variant="outline-warning"
                    className="w-50 mx-2"
                    onClick={handleCancel}
                  >
                    Avbryt
                  </Button>
                </div>
              </Form>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
