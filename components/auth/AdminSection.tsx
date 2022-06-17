import { ReactNode, useEffect, useState } from 'react';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../../config/firebase.config';

interface Props {
    children: ReactNode;
}

const AdminSection = (props: Props) => {
    const [contentReady, setContentReady] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        console.log({ auth });
        if (auth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                    router.push('/admin/login');
                }
                setContentReady(true);
            });
        }
    }, []);

    if (contentReady) {
        return <>props.children</>;
    }
    return <h1>Loading.....</h1>;
};

export default AdminSection;
