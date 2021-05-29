import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

export const stickRef = (Component, method = "") => {
  return forwardRef((props, ref) => {
    const modalRef = useRef({ sheet: null });
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open() {
        if (method == "CLEAN_UP") return setVisible(true);
        modalRef.current.sheet.open();
      },
      close() {
        if (method == "CLEAN_UP") return setVisible(false);
        modalRef.current.sheet.close();
      },
    }));

    if (method == "CLEAN_UP" && visible == false) return null;
    return (
      <Component {...props} ref={(ref) => (modalRef.current.sheet = ref)} />
    );
  });
};
