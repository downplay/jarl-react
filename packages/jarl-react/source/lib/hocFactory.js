import hoistStatics from "hoist-non-react-statics";

const hocFactory = classBuilder => options => WrappedComponent => {
    const HocComponent = classBuilder({ options, WrappedComponent });

    HocComponent.WrappedComponent = WrappedComponent;
    HocComponent.displayName = `${HocComponent.displayName}(${
        WrappedComponent.displayName
    })`;

    return hoistStatics(HocComponent, WrappedComponent);
};

export default hocFactory;
