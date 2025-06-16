export default async (blob) => {
  const stringifiedData = await blob.text();

  if (blob.type === 'application/json') {
    const parsedData = JSON.parse(stringifiedData);
    return parsedData;
  }

  return stringifiedData;
};
