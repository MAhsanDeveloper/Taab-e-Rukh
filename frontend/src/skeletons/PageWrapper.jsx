// src/skeletons/PageWrapper.jsx
import { Suspense } from "react";

const PageWrapper = (LazyComponent, Skeleton = null) => {
  return (props) => (
    <Suspense fallback={Skeleton || <div className="py-10  text-center">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default PageWrapper;
