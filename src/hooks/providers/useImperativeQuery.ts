import { useQuery } from '@apollo/client';

const useImperativeQuery = (query: any) => {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables: any = undefined) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
};

export default useImperativeQuery;
