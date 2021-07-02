const LoadingSpin = ({ loading = true }: any): any => {
  if (loading) {
    return <div>Loading</div>;
  } else {
    return null;
  }
};

export default LoadingSpin;
