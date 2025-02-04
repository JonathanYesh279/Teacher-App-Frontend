import { httpService } from './http.service';

export const authService = {
  login,
  logout,
  getLoggedInTeacher,
};

async function login(email, password) {
  try {
    const response = await httpService.post('auth/login', { email, password });

    if (response?.teacher && response?.loginToken) {
      sessionStorage.setItem('teacher', JSON.stringify(response.teacher));
      sessionStorage.setItem('loginToken', response.loginToken);
      return response.teacher;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
}

async function logout() {
  try {
    await httpService.post('auth/logout');
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    sessionStorage.removeItem('teacher');
    sessionStorage.removeItem('loginToken');
  }
}

function getLoggedInTeacher() {
  const teacher = sessionStorage.getItem('teacher');
  return teacher ? JSON.parse(teacher) : null;
}
