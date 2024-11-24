import { Link, useNavigate, useParams } from 'react-router-dom';
import Backs from '../../../components/Back/Back';
import Tiles from '../../../components/titles/Title';
import styles from './universityDetail.module.css';
import { useEffect, useState } from 'react';
import Buttons from '../../../components/filed/button/button';

import Loading from '../../../components/loading/Loading';
import useLoading from '../../../hooks/useLoading';
import { getUniversityDetail } from '../../../services/axiosApplicant';
import Authorize from '../../../components/authorize/Authorize';

function Items(props: any) {
  const { text, label, links, isNewTab, isLoading = false } = props;

  return (
    <div className={styles.item}>
      <label>{label}</label>
      {isLoading ? (
        <span>
          <Loading isOverlay={false} size="small" />
        </span>
      ) : (
        <>
          {links ? (
            <Link to={links} target={isNewTab ? '_blank' : '_self'} rel={isNewTab ? 'noopener noreferrer' : undefined}>
              {text}
            </Link>
          ) : (
            <span>{text}</span>
          )}
        </>
      )}
    </div>
  );
}

export function UniversityDetail() {
  const { id } = useParams();
  const [university, setUniversity] = useState();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const fetchUniversity = async () => {
    try {
      const res = await getUniversityDetail(id);
      setUniversity(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUniversity();
  }, []);



  return (
    <div className={`${styles.contract}`}>
      <Backs types="link" ishowIcon={true} texts="Back" />
      <div className={styles.detailEmployee}>
        <Tiles texts={`University - ${university?.name}`} fontSize={22} fontWeight={700} />
      </div>

      <div className={`${styles.basic} ${styles.information}`}>
        <Tiles texts="Basic Information" fontSize={22} fontWeight={500} customClass={styles.titles} />
        <Items label="Name:" text={university?.name} />
        <Items label="English Name:" text={university?.english_name} />
        <Items label="Original Name" text={university?.original_name} />
        <Items label="Location:" text={university?.location} />
        <Items label="Country:" text={university?.country?.name} />
        <Items label="Ranking:" text={university?.ranking ? university?.ranking : 'Unknown'} />
      </div>
      <div className="buttonBox">
        <Authorize allowedPermission="update_university">
          <Buttons texts="Update" status="success" handleClick={() => setOpenEdit(true)} />
        </Authorize>
        <Authorize allowedPermission="delete_university">
          <Buttons texts="Delete" status="danger" handleClick={() => setOpenDelete(true)} />
        </Authorize>
        <Buttons texts="Close" status="cancel" handleClick={() => navigate(-1)} />
      </div>
    
    </div>
  );
}
