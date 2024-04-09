import React, { useEffect, useState } from "react";
import { Button, Divider, Select, Typography } from "antd";
import { useConfig } from "../../globales/Context";

import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { formatNumber } from "../../globales/Fuctions";
const { Text } = Typography;
import { usePDF, Resolution, Margin } from "react-to-pdf";
import { DownloadOutlined } from "@ant-design/icons";

export default function Rapport() {
  const [dateintem, setDateIteme] = useState([]);
  const { config } = useConfig();
  const [raport, setRapport] = useState<any>();
  const [depense, setDepense] = useState([]);
  const date = new Date();
  const { toPDF, targetRef } = usePDF({
    filename: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-Rapport.pdf`,
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.MEDIUM,
      // default is 'A4'
      //format: '',
      // default is 'portrait'
      //orientation: 'landscape',
    },
  });

  const onChange = (value: string) => {
    let groupedData = {}; // Utiliser un objet pour stocker temporairement les données groupées
    const searchedDate = value.trim();

    config.cluster.documents.facture_restaurant.forEach((item) => {
      if (item.date === searchedDate) {
        item.data.forEach((product) => {
          if (groupedData[product.name]) {
            // Si le produit existe déjà, ajouter la quantité
            groupedData[product.name].qt += product.qt;
          } else {
            // Sinon, initialiser le produit avec sa quantité
            groupedData[product.name] = {
              name: product.name,
              qt: product.qt,
              pu: product.pu,
            };
          }
        });
      }
    });

    // Convertir l'objet en résultat final
    const finalResult = Object.values(groupedData).map((product) => ({
      key: product.name, // Utiliser le nom du produit comme clé
      name: product.name,
      qt: product.qt,
      pu: product.pu,
    }));

    const depenseGroup = {};

    // Parcourir chaque élément du cluster.documents.depenses
    config.cluster.documents.depenses.forEach((item) => {
      // Parcourir chaque élément de données dans chaque élément
      item.data.forEach((depense) => {
        // Créer une clé unique pour chaque produit basée sur son nom et sa date
        const key = `${depense.motif}_${item.date}`;
        // Vérifier si le produit existe déjà dans groupedData
        if (depenseGroup[key]) {
          // Si le produit existe déjà, ajouter le montant
          depenseGroup[key].montant += parseFloat(depense.montant);
        } else {
          // Sinon, initialiser le produit avec son montant
          depenseGroup[key] = {
            motif: depense.motif,
            date: item.date,
            montant: parseFloat(depense.montant),
          };
        }
      });
    });

    // Convertir l'objet en résultat final
    const depenseFinale = Object.values(depenseGroup).map((depense) => ({
      key: `${depense.motif}_${depense.date}`, // Utiliser une clé unique pour chaque produit
      motif: depense.motif,
      date: depense.date,
      montant: depense.montant,
    }));
    //console.log({ date: searchedDate, data: depenseFinale });
    setDepense(depenseFinale);

    setRapport({ date: searchedDate, data: finalResult });
  };

  useEffect(() => {
    let a = config.cluster.documents.facture_restaurant;
    let uniqueDates = [];

    // Filtrer les dates uniques
    let uniqueDatesArray = a.reduce((acc, item) => {
      if (!uniqueDates[item.date]) {
        uniqueDates[item.date] = true;
        acc.push({ value: item.date, label: item.date });
      }
      return acc;
    }, []);

    setDateIteme(uniqueDatesArray);
  }, [config]);

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span style={{ fontSize: 16 }}>{text}</span>,
    },
    {
      title: "Quantite",
      dataIndex: "qt",
      render: (text) => <span style={{ fontSize: 16 }}>{text}</span>,
    },
    {
      title: "Prix unitaire",
      dataIndex: "pu",

      render: (text) => (
        <span style={{ fontSize: 16 }}>{formatNumber(text)}</span>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Select
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
        options={dateintem}
      />

      {raport && (
        <div
          ref={targetRef}
          style={{ paddingTop: 10, justifyContent: "center", width: "70%" }}
        >
          <header
            style={{
              backgroundColor: "#007bff",
              color: " #ffffff",
              padding: " 20px 0",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#fff" }}>Rapport Journalier</h1>
            <p>DATE: 19/02/2024</p>
            <p>
              ÉMIS PAR:
              <span
                style={{ textTransform: "capitalize" }}
                contentEditable
              ></span>
            </p>
          </header>
          <Table
            columns={columns}
            pagination={false}
            dataSource={raport.data}
            summary={(pageData) => {
              let totalBorrow = 0;
              let totalRepayment = 0;
              let totalAmout = 0;
              let amouteTotalDepense = 0;

              pageData.forEach(({ qt, pu }) => {
                totalBorrow += Number(qt);
                totalRepayment += Number(pu);
                totalAmout += Number(qt) * Number(pu);
              });

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text style={{ fontSize: 16 }}>Sous total de vente</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text style={{ fontWeight: "bold" }}>
                        {totalBorrow} X{" "}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text style={{ fontWeight: "bold" }}>
                        {formatNumber(totalRepayment)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text style={{ fontSize: 16 }}>Montant Total vente</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      <Text style={{ fontWeight: "bold" }}>
                        {formatNumber(totalAmout)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ width: "100%" }}>
                    <Table.Summary.Cell index={3} colSpan={3}>
                      <Text style={{ fontSize: 17, fontWeight: 400 }}>
                        Dépenses quotidiennes
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>

                  {depense &&
                    depense.length > 0 &&
                    depense.map((item, i) => {
                      amouteTotalDepense += Number(item.montant);
                      return (
                        <div
                          style={{
                            width: "125%",
                            paddingTop: 10,
                            paddingLeft: 17,
                          }}
                        >
                          <Table.Summary.Row
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              textTransform: "capitalize",
                              alignItems: "center",
                            }}
                          >
                            <Table.Summary.Cell index={i + i * 4}>
                              <Text style={{ fontSize: 16 }}>{item.motif}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={i + i * 6} colSpan={2}>
                              <Text style={{ fontWeight: "bold" }}>
                                {formatNumber(Number(item.montant))}
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </div>
                      );
                    })}
                  <Divider />
                  <div
                    style={{
                      width: "125%",
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: 17,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                      Tatale Generale{" "}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                      {formatNumber(totalAmout - amouteTotalDepense)}
                    </Text>
                  </div>
                </>
              );
            }}
          />
        </div>
      )}
      {raport && (
        <Button
          type="primary"
          style={{ marginTop: 30 }}
          onClick={() => toPDF()}
          icon={<DownloadOutlined />}
        >
          Enregister le pdf
        </Button>
      )}
    </div>
  );
}
