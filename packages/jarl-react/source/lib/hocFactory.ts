import hoistStatics from "hoist-non-react-statics";
import { ComponentType } from "react";

/**
 * Wraps a class-builder function so that the resulting HOC forwards displayName
 * and hoists any static members from the wrapped component, as is conventional
 * for React higher-order components.
 */
const hocFactory = <P extends object>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classBuilder: (WrappedComponent: ComponentType<any>) => ComponentType<any>
) => (WrappedComponent: ComponentType<P>): ComponentType<P> => {
    const HocComponent: any = classBuilder(WrappedComponent);

    HocComponent.WrappedComponent = WrappedComponent;
    HocComponent.displayName = `${HocComponent.displayName}(${
        (WrappedComponent as any).displayName || WrappedComponent.name
    })`;

    return hoistStatics(HocComponent, WrappedComponent as any);
};

export default hocFactory;
