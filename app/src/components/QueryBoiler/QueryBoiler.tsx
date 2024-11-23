import { UseQueryResult } from "@tanstack/react-query";
import Loading from "../Loading";
import Empty from "../Empty";
import ErrorMsg from "../ErrorMsg";

const QueryBoiler = ({ query }: {
  query: UseQueryResult,
}) => {
  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorMsg />;
  if (query.data === null) return <Empty />;
  return null;
};

export default QueryBoiler;
