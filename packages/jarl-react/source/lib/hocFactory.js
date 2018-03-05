import hoistStatics from "hoist-non-react-statics";

const hocFactory = classBuilder => WrappedComponent => {
    const HocComponent = classBuilder(WrappedComponent);

    HocComponent.WrappedComponent = WrappedComponent;
    HocComponent.displayName = `${HocComponent.displayName}(${
        WrappedComponent.displayName
    })`;

    return hoistStatics(HocComponent, WrappedComponent);
};

export default hocFactory;
