import React, { useState, useEffect } from "react";
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
	Button,
} from "antd";
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createWorker } from "tesseract.js";

import "./App.css";
function App() {
	const { Header, Content } = Layout;
	const { Title } = Typography;
	const { Option } = Select;
	const { Dragger } = Upload;
	const [uploadedFile, setUploadedFile] = useState();
	const [copied, setCopied] = useState(false);
	const [extractedText, setExtractedText] = useState("");
	const [lang, setLang] = useState("eng");
	const [recognizing, setRecognizing] = useState(false);
	const props = {
		name: "file",
		multiple: false,
		accept: "image/jpeg,image/png,image/jpg,image/webp",
		// action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
		onChange(info) {
			const { status } = info.file;
			// if (status === "uploading") {
			// 	// console.log(info.file, info.fileList);
			// 	console.log("uploading....");
			// }
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
	const langHandler = (value) => setLang(value);
	const worker = createWorker({
		logger: (m) => {
			const { status } = m;
			if (status === "recognizing text") {
				setRecognizing(true);
			}
		},
	});

	const convertImageToText = async () => {
		await worker.load();
		await worker.loadLanguage(lang);
		await worker.initialize(lang);
		const {
			data: { text },
		} = await worker.recognize(uploadedFile);

		setExtractedText(text);
		setRecognizing(false);
		await worker.terminate();
	};

	useEffect(() => {
		if (!uploadedFile) return;
		convertImageToText();
	}, [uploadedFile]);

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
								<Select defaultValue="English" onChange={langHandler}>
									<Option value="eng">English</Option>
									<Option value="fra">French</Option>
									<Option value="ara">Arabic</Option>
									<Option value="deu">German</Option>
									<Option value="spa">Spanish</Option>
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
							{extractedText && (
								<div className="d-flex justify-end">
									<CopyToClipboard
										text={extractedText}
										onCopy={() => {
											setCopied(true);
											setTimeout(() => {
												setCopied(false);
											}, 2000);
										}}
									>
										<Button
											type="primary"
											icon={copied && <CheckCircleOutlined />}
										>
											{!copied && "Copy text"}
											{copied && "Text copied"}
										</Button>
									</CopyToClipboard>
								</div>
							)}
							{recognizing && <Skeleton active />}
							{!recognizing && extractedText && (
								<div className="text">{extractedText}</div>
							)}
						</Col>
					</Row>
				</Content>
			</div>
		</React.Fragment>
	);
}

export default App;
