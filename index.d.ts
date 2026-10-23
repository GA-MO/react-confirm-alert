import { Component, type ButtonHTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactElement, type ReactNode } from 'react';
export type ReactConfirmAlertButton = {
    label: string;
    className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export interface ReactConfirmAlertProps {
    targetId?: string;
    title?: string;
    message?: string;
    buttons?: Array<ReactConfirmAlertButton>;
    childrenElement?: () => ReactNode;
    customUI?: (customUiOptions: {
        title: string;
        message: string;
        buttons: Array<ReactConfirmAlertButton>;
        onClose: () => void;
    }) => ReactNode;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    keyCodeForClose?: Array<number>;
    willUnmount?: () => void;
    afterClose?: () => void;
    onClickOutside?: () => void;
    onKeypressEscape?: (event: KeyboardEvent) => void;
    onkeyPress?: () => void;
    overlayClassName?: string;
}
type Props = ReactConfirmAlertProps & Required<Pick<ReactConfirmAlertProps, 'buttons' | 'childrenElement' | 'closeOnClickOutside' | 'closeOnEscape' | 'keyCodeForClose' | 'willUnmount' | 'afterClose' | 'onClickOutside' | 'onKeypressEscape'>>;
export default class ReactConfirmAlert extends Component<ReactConfirmAlertProps> {
    static defaultProps: {
        buttons: {
            label: string;
            onClick: () => null;
            className: null;
        }[];
        childrenElement: () => null;
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        keyCodeForClose: never[];
        willUnmount: () => null;
        afterClose: () => null;
        onClickOutside: () => null;
        onKeypressEscape: () => null;
    };
    props: Props;
    overlay: HTMLDivElement | null;
    handleClickButton: (button: ReactConfirmAlertButton) => void;
    handleClickOverlay: (e: ReactMouseEvent<HTMLDivElement>) => void;
    close: () => void;
    keyboard: (event: KeyboardEvent) => void;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    renderCustomUI: () => ReactNode;
    render(): ReactElement;
}
export declare function confirmAlert(properties: ReactConfirmAlertProps): void;
export {};
