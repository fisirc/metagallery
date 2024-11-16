import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, MouseEvent } from "react";
import styles from './Popup.module.css';

function Popup(props: {
  trigger: any;
  setTrigger: (arg0: boolean) => void;
  children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
}) {

  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      props.setTrigger(false);
    }
  };

  return (props.trigger) ? (
    <div className={styles.popup} onClick={handleClose}>
      <div className={styles.popupinner}>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default Popup;
