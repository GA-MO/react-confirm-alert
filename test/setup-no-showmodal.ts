// RCA_NO_SHOWMODAL=1 runs every test as in a browser without <dialog>.showModal (Safari < 15.4, jsdom).
delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
