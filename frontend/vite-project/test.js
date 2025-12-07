import axios from 'axios';

axios
  .get('http://localhost:8080/api/users')
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));
