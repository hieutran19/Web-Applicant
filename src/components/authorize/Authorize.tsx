import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rolePermissions } from './PermissionTranslate';

const Authorize = (props: any) => {
  const { allowedPermission, children, isRouter = false } = props;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
        const userRoles = user?.roles || [];

        const userPermissions = userRoles.flatMap((role: string) => rolePermissions[role] || []);

        const hasPermission = userPermissions.includes(allowedPermission);
        if (hasPermission) {
          setIsAuthorized(true);
        } else {
          if (isRouter) {
            navigate('/unauthorized');
          }
          setIsAuthorized(false);
        
      }
    }
  }, [allowedPermission]);

  return isAuthorized ? <>{children}</> : null;
};

export default Authorize;