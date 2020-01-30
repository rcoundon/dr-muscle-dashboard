export default async function login(
  axiosInstance,
  {
    authType,
    username,
    password,
    accessToken,
    grantType,
    provider,
    email,
    name
  }
) {
  const params = new URLSearchParams();
  if (authType === 'email') {
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
  }
  if (authType === 'google') {
    params.append('grant_type', grantType);
    params.append('accesstoken', accesstoken);
    params.append('provider', 'google');
    params.append('email', email);
    params.append('name', name);
  }

  const { data } = await axiosInstance.post('/token', params);
  return data;
}
