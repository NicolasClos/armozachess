import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';

export const CreateTournamentToast = () => {
    toast.success("¡Torneo creado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const DeleteTournamentToast = () => {
    toast.success("¡Torneo eliminado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const CreateTournamentErrorToast = () => {
    toast.error("¡Ya existe un torneo con mismo nombre!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const EmptyTournamentErrorToast = () => {
    toast.error("¡Ya existe un torneo con mismo nombre!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerToast = () => {
    toast.success("¡Jugador agregado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const DeletePlayerToast = () => {
    toast.success("¡Jugador eliminado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerErrorToast = () => {
    toast.error("¡Debe escribir tanto 'Nombre' como 'Apellido'!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerError2Toast = () => {
    toast.error("¡Ya existe un jugador con este nombre!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const StartTournamentErrorToast = () => {
    toast.error("¡No puede empezar un jugador sin ningún jugador!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
    });
};

//import { CreateTournamentToast, DeleteTournamentToast, CreateTournamentErrorToast, AddPlayerToast, DeletePlayerToast, AddPlayerErrorToast, AddPlayerError2Toast, StartTournamentErrorToast  } from '@/components/toasts'