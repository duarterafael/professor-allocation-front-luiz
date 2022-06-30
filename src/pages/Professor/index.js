import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint="/professors";
const columns = [
    {value: "ID", id:"id"},
    {value: "Name", id:"name"},
    { value: "CPF", id: "cpf" },
    {
      value: "Department",
      id: "departmentId",
      //render: (department) => department.name,
    },
];

const INITIAL_STATE = {id:0, name:"", cpf: "", departmentId: 0};


const Professor = () => {
    const [visible, setVisible] = useState(false);
    const [professor, setProfessor] = useState(INITIAL_STATE);
    const [departments, setDepartments] = useState([]);

     useEffect(() => {
         api
          .get("/departments")
          .then((response) => {
            setDepartments(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
         }, []);


         const handleSave = async(refetch) => {
            const data = {
            name: professor.name,
            cpf: professor.cpf,
            departmentId: professor.departmentId,
          };
         try {
            if(professor.id){
                await api.put(`${endpoint}/${professor.id}`,data);
                toast.success("Atualizado com sucesso");
            } else {
                await api.post(endpoint, data);
                toast.success("Departamento cadastrado com sucesso!");
            }
            setVisible(false);
            await refetch();
            } catch (error){
            toast.error(error.message);
            }
            };
          
        const handleClose = () => setVisible(false);

        const actions =[
        {
            name:"edit",
            action:({ id, name, cpf, department: { id: departmentId } }) => {
                setProfessor({ id, name, cpf, department: { id: departmentId } });
                setVisible(true);
            },
        },
        {
            
                name:"remove",
                action:async(professor,refetch)=>{
                    if(window.confirm("Você tem certeza disso?")){
                        try{
                            await api.delete(`${endpoint}/${professor.id}`);
                            await refetch();
                            toast.info(`Professor ${professor.name} foi removido`);
                        }catch(error){
                            toast.info(error.menssage);
                        }

                    }
                },
            
        },
    ];

    const onChange = ({ target: { name, value } }) => {
        setProfessor({
          ...professor,
          [name]: value,
        });
      };

    return(
        <Page title="Professors">
        
        <Button className="mb-2" 
        onClick={()=>{
            setProfessor(INITIAL_STATE);
            setVisible(true);
        }}> Create professor</Button>

        <ListView
        actions={actions}
        columns={columns}
        endpoint={endpoint}
        >
            {({refetch}) => ( 
                <Modal
                title={`${professor.id ? "Update" : "Create"} Professor`}
                show={visible}
                handleSave={() => handleSave(refetch)}
                handleClose={() => handleClose()}
                >
                <Form>
                    <Form.Group>
                        <Form.Label>Professor Name</Form.Label>
                        <Form.Control
                        name="name"
                        onChange={onChange}
                        value={professor.name}
                        />
                    </Form.Group>
                    <Form.Group>
                <Form.Label>Professor CPF</Form.Label>
                <Form.Control
                  name="cpf"
                  onChange={onChange}
                  value={professor.cpf}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <select
                  className="form-control"
                  name="departmentId"
                  onChange={onChange}
                  value={professor.departmentId}
                >
                  <option>Select one department</option>
                  {departments.map((department, index) => {
                    return (
                      <option key={index} value={department.id}>
                        {department.name}
                      </option>
                    );
                  })}
                </select>
              </Form.Group>
            </Form>    
            </Modal>
                
            )}
        </ListView>
        </Page>
    );
};

export default Professor;