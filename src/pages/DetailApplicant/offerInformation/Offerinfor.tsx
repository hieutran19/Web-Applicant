import { useEffect, useState } from "react";
import Tiles from "../../../components/titles/Title";
import styles from "./OfferInfor.module.css";
import { getOfferInfor } from "../../../services/AxiosDetailApplicant";
import { convertLinks } from "../../../utils/utils";


interface OfferInfor {
    type: string;
    position_applied: string;
    director_manager: string;
    director_name: string;
    salary: number;
    start: string;
    end: string;
    acceptance_date: string;
    designation?: string; // Thêm vào nếu cần
    allowance_drink?: boolean; // Thêm vào nếu cần
    allowance_lunch?: boolean; // Thêm vào nếu cần
    allowance_parking?: boolean; // Thêm vào nếu cần
    company_email?: string; // Thêm vào nếu cần
    attachment?:any
}
interface ItemsProps {
    label: string;
    text: string;
    link?: string;
  }
function Items({ text, label, link }: ItemsProps) {
    return (
      <div className={styles.item}>
        <label className={styles.boldLabel}>{label}</label>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </div>
    );
  }
const OfferInfor = ({ id }) => {
  const [offerInfor, setOfferInfor] = useState<OfferInfor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferInfor = async () => {
      try {
        const offerInforRes = await getOfferInfor(id);
        const offerings = offerInforRes.data.offering;
        if (offerings.length > 0) {
          setOfferInfor(offerings[offerings.length - 1]);
        }
      } catch (error) {
        console.error("Failed to fetch offer information:", error);
        setError("Could not fetch offer information.");
      }
    };

    fetchOfferInfor();
  }, [id]);

  if (error) return <p>{error}</p>;

  if (!offerInfor) return <p></p>; 


  const typeValue = parseInt(offerInfor?.type || "", 10);

  const typeText = typeValue === 1
    ? "Internship"
    : typeValue === 2
    ? "Probation"
    : "";

  const allowances = [];
  if (offerInfor?.allowance_drink) allowances.push("Drink");
  if (offerInfor?.allowance_lunch) allowances.push("Lunch");
  if (offerInfor?.allowance_parking) allowances.push("Parking");

  // Gộp các tên phúc lợi lại thành một chuỗi
  const allowancesText = allowances.join(", "); 

  return (
    <div className={`${styles.basic} ${styles.information}`}>
      <Tiles
        texts="Offer Information"
        fontSize={22}
        fontWeight={500}
        customClass={styles.titles}
      />
      <Items label="Director Name:" text={offerInfor?.director_name} />
      <Items label="Designation:" text={offerInfor?.designation} />
      
      <Items label="Type:" text={typeText} />
      <Items label="Position Applied:" text={offerInfor?.position_applied} />
      <Items label="Salary:" text={`${offerInfor?.salary}`} />
      <Items label="Start Date:" text={offerInfor?.start} />
      <Items label="End Date:" text={offerInfor?.end} />
      <Items label="Allowances:" text={allowancesText || 'None'}  />
      <Items label="Acceptance Date:" text={offerInfor?.acceptance_date} />
      <Items label="Employee Email:" text={offerInfor?.company_email} />
      <Items
            label="Contract:"
            text="View Contract"
            link={convertLinks(offerInfor?.attachment)}
          />
    </div>
  );
};

export default OfferInfor;
