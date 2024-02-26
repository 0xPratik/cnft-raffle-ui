/* eslint-disable @next/next/no-img-element */

type SelectImageProps = {
  imageUri: string;
};

export const SelectImage = ({ imageUri }: SelectImageProps) => {
  // useEffect(() => {
  //   const loadImage = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await axios.get(imageUri);
  //       setImage(res.data.image);
  //     } catch (err) {
  //       setError(err);
  //       setImage("/img/placeholder.png");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadImage();
  // }, [imageUri]);

  return (
    <>
      <img
        src={imageUri}
        alt="Image"
        className="w-full h-[160px] object-cover "
      />
    </>
  );
};
