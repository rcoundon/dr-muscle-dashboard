export default async function login(axiosInstance, username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');

  const { data } = await axiosInstance.post('/token', params);
  return data;
}
