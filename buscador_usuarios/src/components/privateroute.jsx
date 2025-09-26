import usesAuth from '../context/AuthContext';

export function PrivateRoute({ children }) {
    const { user } = usesAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
}