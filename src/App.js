// package imports
import React, { useState, useEffect } from "react";
import cx from "classnames";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Badge,
  Button,
  ButtonGroup,
} from "reactstrap";
import _ from "lodash";
import Select from "react-select";
import { IoGridSharp, IoListOutline } from "react-icons/io5";
import { DebounceInput } from "react-debounce-input";
import { FaRegTimesCircle } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";

// project imports
import initCatalog from "./utils/catalog.json";
import constants from "./utils/constants";
import { ItemCard, ItemRow } from "./components";
import "./App.scss";

function App() {
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewType, setViewType] = useState(constants.VIEWS.grid);
  const [noOfItems, setNoOfItems] = useState(10);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [noOfPiecesFilter, setNoOfPiecesFilter] = useState();

  const isGridView = viewType === constants.VIEWS.grid;

  const [selections, categoryOptions] =
    categories && categories.length
      ? _.partition(categories, (x) => x.isSelected)
      : [[], []];

  useEffect(() => {
    let products = Object.assign([], initCatalog);
    products = _.map(products, (x) => {
      x.tags = _.split(x.tags, ",");
      if (x.retailPrice) {
        x.percentOff = (100 - ((x.price / x.retailPrice)*100)).toFixed(0)
      }
      return x;
    });
    setCatalog(products);
    let cats = _.chain(products)
      .map((x) => x.tags)
      .flatten()
      .uniq()
      .map((x) => {
        let opt = {};
        opt.label = x;
        opt.value = x;
        opt.isSelected = false;
        return opt;
      })
      .sortBy((x) => {
        return x.label;
      })
      .value();
    setCategories(cats);
  }, []);

  useEffect(() => {
    let list = catalog.slice();
    if (selections && selections.length > 0) {
      list = _.filter(list, (x) => {
        return _.every(selections, (y) => {
          return _.some(x.tags, (tag) => {
            return tag === y.value;
          });
        });
      });
    }
    if (showFavorites) {
      list = _.filter(list, (x) => {
        return x.isFavorite;
      });
    }
    let pieceNum = parseInt(noOfPiecesFilter, 10);
    if (pieceNum > 1) {
      list = _.filter(list, (x) => {
        return x.isSet && x.qty >= pieceNum;
      });
    }
    list = _.take(list, noOfItems);
    if (!_.isEqual(list, filteredList)) {
      setFilteredList(list);
    }
  }, [noOfItems, selections, filteredList, noOfPiecesFilter, catalog, showFavorites]);

  function toggleView() {
    setViewType(isGridView ? constants.VIEWS.list : constants.VIEWS.grid);
  }

  function setFavorite(index) {
    let newList = catalog.slice();
    newList = _.map(newList, (x) => {
      x.isFavorite = !x.isFavorite;
      return x;
    });
    setCatalog(newList);
  }

  function deleteTagFilter(itemToDel) {
    let newList = _.assign([], categories);
    newList = _.map(newList, (x, idx) => {
      if (x.value === itemToDel.value) {
        x.isSelected = false;
      }
      return x;
    });
    setCategories(newList);
  }

  function onTagSelect(selection) {
    let newList = _.assign([], categories);
    newList = _.map(newList, (x) => {
      if (selection.value === x.value) {
        x.isSelected = true;
      }
      return x;
    });
    setCategories(newList);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Row className="mb-2 mx-2">
          <Col xs="12" md="2">
            Tags:
          </Col>
          <Col xs="12" md="4">
            <Select
              options={categoryOptions}
              onChange={(selection) => onTagSelect(selection)}
              closeMenuOnSelect={false}
              value={""}
            />
          </Col>
          <Col xs="12" md="2">
            # of Pieces:
          </Col>
          <Col xs="12" md="4">
            <DebounceInput
              value={noOfPiecesFilter}
              onChange={e => setNoOfPiecesFilter(e.target.value)}

            />
          </Col>
        </Row>
        <Row className="mx-2">
          <Col xs="12" md="8">
            {_.map(selections, (x, idx) => {
              return (
                <Badge
                  key={x.value}
                  className="m-1"
                  onClick={() => deleteTagFilter(x)}
                >
                  {x.label}
                  <div className="text-white ms-2 d-inline"><FaRegTimesCircle size="1.5em" /></div>
                </Badge>
              );
            })}
          </Col>
          <Col xs="12" md="4">
            <ButtonGroup className="float-end">
              <Button
                className={cx(
                  {
                    active: isGridView,
                  },
                  "viewTypeButton"
                )}
                onClick={toggleView}
                outline
              >
                <IoGridSharp />
              </Button>
              <DebounceInput
                value={noOfItems}
                onChange={(e) => setNoOfItems(e.target.value)}
                debounceTimeout={500}
                className="smallInput"
                type="number"
              />
              <Button
                className={cx(
                  {
                    active: !isGridView,
                  },
                  "viewTypeButton"
                )}
                onClick={toggleView}
              >
                <IoListOutline />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </header>
      <div className="main">
        <Container>
          <Row className="mt-2">
            {filteredList && filteredList.length > 0 ? (
              <>
                {isGridView ? (
                  _.map(filteredList, (item, index) => {
                    return (
                      <Col key={`productCard${index}`} xs={12} md={3}>
                        <ItemCard item={item} />
                      </Col>
                    );
                  })
                ) : (
                  <>
                    <Col xs="12">
                      {_.map(filteredList, (item, index) => {
                        return (
                          <ItemRow item={item} key={`productRow${index}`} />
                        );
                      })}
                    </Col>
                  </>
                )}
              </>
            ) : null}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
