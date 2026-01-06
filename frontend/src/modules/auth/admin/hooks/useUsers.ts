import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUser } from '../../services/user.api';

export const useUsers = () => {
  const qc = useQueryClient();
  const usersQ = useQuery(['users'], fetchUsers);
  const update = useMutation(({ id, payload }:{id:string; payload:any}) => updateUser(id, payload), {
    onSuccess: () => qc.invalidateQueries(['users'])
  });
  return { usersQ, updateUser: update };
};
