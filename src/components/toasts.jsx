import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';

export const CreateTournamentToast = () => {
    toast.dismiss()
    toast.success("¡Torneo creado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
    toast.dismiss()
};

export const DeleteTournamentToast = () => {
    toast.dismiss()
    toast.success("¡Torneo eliminado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
    toast.dismiss()
};

export const CreateTournamentErrorToast = () => {
    toast.dismiss()
    toast.error("¡Ya existe un torneo con mismo nombre!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const EmptyTournamentErrorToast = () => {
    toast.dismiss()
    toast.error("¡Escriba un nombre para el torneo!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerToast = () => {
    toast.dismiss()
    toast.success("¡Jugador agregado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const DeletePlayerToast = () => {
    toast.dismiss()
    toast.success("¡Jugador eliminado correctamente!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerErrorToast = () => {
    toast.dismiss()
    toast.error("¡Debe escribir tanto 'Nombre' como 'Apellido'!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const AddPlayerError2Toast = () => {
    toast.dismiss()
    toast.error("¡Ya existe un jugador con este nombre!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: false,
        theme: "dark",
    });
};

export const StartTournamentErrorToast = () => {
    toast.dismiss()
    toast.error("¡No puede empezar un jugador sin ningún jugador!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
    });
};

//import { CreateTournamentToast, DeleteTournamentToast, CreateTournamentErrorToast, AddPlayerToast, DeletePlayerToast, AddPlayerErrorToast, AddPlayerError2Toast, StartTournamentErrorToast  } from '@/components/toasts'