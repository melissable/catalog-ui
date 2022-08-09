import { Row } from "reactstrap";

export default function ItemCard(props) {
  const { item } = props;
  return (
    <Row className="mb-2 mx-2 itemRow">
      <img alt={item.imageName} src={`./${item.imageName}.jpg`} className='thumbnailImg' />
      {item.title}
    </Row>
  );
}