import { Loader } from '@mantine/core';

const LoadingModal = () => {
  return (
    <div className="group jc-center ai-center p-sm">
      <Loader color="black" size="sm" />
    </div>
  );
};

export default LoadingModal;
