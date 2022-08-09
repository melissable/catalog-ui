import { Card, CardTitle, CardSubtitle, CardText } from "reactstrap";
import _ from 'lodash';
import { BiMap } from 'react-icons/bi';

export default function ItemCard(props) {
  const { item } = props;
  return (
    <Card className="mb-2 itemCard">
      <img alt={item.imageName} src={`./${item.imageName}.jpg`} />
      <CardSubtitle className="text-start mx-3">
        <BiMap style={{ color: "orange" }} className="me-2" />
        {_.startsWith(item.region, "NY")
          ? `Northeast (${item.region})`
          : item.region}
      </CardSubtitle>
      <CardTitle className="text-start mx-3">
        <strong>{item.title}</strong>
      </CardTitle>
      <CardText>
        ${item.price} • Qty: {item.qty}
        {item.retailPrice &&
          <><br/>Est retail: ${item?.retailPrice?.toFixed(0)} | {item.percentOff}% off</>}
        
      </CardText>
    </Card>
  );
}
