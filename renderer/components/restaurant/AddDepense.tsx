import React, { useState } from "react";
import { Button, Divider, Input, Modal, Typography, message } from "antd";
import { useConfig } from "../../globales/Context";
const { Text } = Typography;

const AddDepense: React.FC = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (st: boolean) => void;
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Gérer toute les dépenses ");

  const [Motif, setMotif] = useState<string>();
  const [montant, setMontant] = useState<any>();
  const { setConfig } = useConfig();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (!Motif || Motif.length < 2 || !montant || montant.length < 1) {
      message.error("Veillez renseigner tous les chanps svp ");
      setConfirmLoading(false);
      return;
    }
    let date = new Date();
    window.ipc.send("addDepense", {
      date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      data: [
        {
          motif: Motif,
          montant: montant,
        },
      ],
    });

    window.ipc.on("addDepense", (data) => {
      //@ts-ignore
      if (data?.error) {
        //@ts-ignore
        message.error(data.message);
        setConfirmLoading(false);
      } else {
        //@ts-ignore

        //@ts-ignore
        setConfig(data.data);
        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
          message.success(data.message);
        }, 2000);
      }
    });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Ajouter une Depense"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Text style={{ textAlign: "center" }}>{modalText}</Text>
        <Divider />
        <div>
          <strong>Mofitf de dépense</strong>
          <Input
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Entrer le motif pour lequel vous allez dépenser"
          />
        </div>
        <div>
          <strong>Montant en FC</strong>
          <Input onChange={(e) => setMontant(e.target.value)} type={"number"} />
        </div>
      </Modal>
    </>
  );
};

export default AddDepense;
