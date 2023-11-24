"use client"

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import googleLogo from '../../public/google.png';

export function GoogleLogoutButton() {
    return (
        <button
            onClick={() => { signOut() }}
            className='googleLogoutButton'
        >LogOut
        </button>
    )
}

export function GoogleSignInButton() {

    const handleClick = () => {
        signIn('google');
    }

    return (
        <button
            onClick={handleClick}
            className='googleSignInButton'
        >
            <Image className='GoogleSingInImage' src={googleLogo} alt={'Google Logo'} width={20} height={20} />
            <span>Ingresar con Google</span>
        </button>
    );
}