import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { Formik } from "formik";

export const createFormRef = (Component) =>
  forwardRef((props, ref) => {
    useImperativeHandle(ref, () => props);
    return <Component {...props} />;
  });

export const FormikRef = forwardRef((props, ref) => {
  const _formikProps = useRef({ form: null });

  useImperativeHandle(ref, () => {
    return _formikProps.current;
  });

  return (
    <Formik {...props}>
      {(formikProps) => {
        if (typeof props.children === "function") {
          return props.children({
            ...formikProps,
            ref: (ref) => (_formikProps.current.form = ref),
          });
        }
        return (
          <props.component
            {...formikProps}
            ref={(ref) => (_formikProps.current.form = ref)}
          />
        );
      }}
    </Formik>
  );
});
