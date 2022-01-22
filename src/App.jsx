import React, { useState } from "react";
import {
	Layout,
	Typography,
	Row,
	Col,
	Select,
	Divider,
	Upload,
	Skeleton,
	message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

import "./App.css";
function App() {
	const { Header, Content } = Layout;
	const { Title } = Typography;
	const { Option } = Select;
	const { Dragger } = Upload;
	const [uploadedFile, setUploadedFile] = useState();
	const props = {
		name: "file",
		multiple: false,
		accept: "image/jpeg,image/png,image/jpg,image/webp",
		// action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
		onChange(info) {
			const { status } = info.file;
			if (status === "uploading") {
				// console.log(info.file, info.fileList);
				console.log("uploading....");
			}
			if (status === "done") {
				handlePreview(info.file);
				// message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === "error") {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
	};
	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
			setUploadedFile(file.preview);
		}
	};
	return (
		<React.Fragment>
			<Header className="header">
				<div className="container h-100">
					<Row align="middle" style={{ height: "100%" }}>
						<Col span={24}>
							<Title type="success" level={3}>
								Image to Text
							</Title>
						</Col>
					</Row>
				</div>
			</Header>
			<div className="container">
				<Content className="content">
					<Row className="content__row">
						<Col lg={12} xs={24} className="upload-col">
							<div className="d-flex justify-between">
								<Title level={5}>Upload Image</Title>
								<Select defaultValue="English">
									<Option value="eng">English</Option>
									<Option value="fr">French</Option>
								</Select>
							</div>
							<Divider />
							{!uploadedFile && (
								<Dragger
									{...props}
									customRequest={({ file, onSuccess }) => {
										setTimeout(() => {
											onSuccess("ok");
										}, 0);
									}}
									showUploadList={false}
									// onPreview={handlePreview}
								>
									<p className="ant-upload-drag-icon">
										<InboxOutlined />
									</p>
									<p className="ant-upload-text">
										Click or drag file to this area to upload
									</p>
									<p className="ant-upload-hint">One file at a time</p>
								</Dragger>
							)}
							{uploadedFile && (
								<img
									src={uploadedFile}
									alt="Uploaded file"
									className="uploaded-image"
								/>
							)}
						</Col>
						<Col lg={12} xs={24} className="text-col">
							<Skeleton active />
						</Col>
					</Row>
				</Content>
			</div>
		</React.Fragment>
	);
}

export default App;
