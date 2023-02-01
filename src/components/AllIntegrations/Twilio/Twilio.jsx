/* eslint-disable no-unused-expressions */
import { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { __ } from "../../../Utils/i18nwrap";
import SnackMsg from "../../Utilities/SnackMsg";
import Steps from "../../Utilities/Steps";
import { saveIntegConfig } from "../IntegrationHelpers/IntegrationHelpers";
import { checkMappedFields, handleInput } from "./TwilioCommonFunc";
import TwilioAuthorization from "./TwilioAuthorization";
import IntegrationStepThree from "../IntegrationHelpers/IntegrationStepThree";
import TwilioIntegLayout from "./TwilioIntegLayout";

function Twilio({ formFields, setIntegration, integrations, allIntegURL }) {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setstep] = useState(1);
    const [snack, setSnackbar] = useState({ show: false });

    const twilioFields = [
        { key: "To", label: "To", required: true },
        { key: "Body", label: "Message Body", required: true },
    ];

    const [twilioConf, setTwilioConf] = useState({
        name: "Twilio",
        type: "Twilio",
        sid:
            process.env.NODE_ENV === "development"
                ? "AC320b8d36a8a82cebf0b9356f36bf43e9"
                : "",
        token:
            process.env.NODE_ENV === "development"
                ? "ec4d20136c1af5c033c545c6c7b1257f"
                : "",
        from_num: process.env.NODE_ENV === "development" ? "01861054127" : "",
        field_map: [
            { formField: "", twilioField: "To" },
            { formField: "", twilioField: "Body" },
        ],
        twilioFields,
    });

    const saveConfig = () => {
        setIsLoading(true);
        const resp = saveIntegConfig(integrations, setIntegration, allIntegURL, twilioConf, history);
    };
    const nextPage = (pageNo) => {
        if (!checkMappedFields(twilioConf)) {
            toast.error("Please map mandatory fields");
            return;
        }
        twilioConf.field_map.length > 0 && setstep(pageNo);
    }; 
    document.querySelector('.btcd-s-wrp').scrollTop = 0

    return (
        <div>
            <SnackMsg snack={snack} setSnackbar={setSnackbar} />
            <div className="txt-center w-9 mt-2">
                <Steps step={3} active={step} />
            </div>

            {/* STEP 1 */}

            <TwilioAuthorization
                twilioConf={twilioConf}
                setTwilioConf={setTwilioConf}
                step={step}
                setstep={setstep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setSnackbar={setSnackbar}
            />

            {/* STEP 2 */}
            <div
                className="btcd-stp-page"
                style={{
                    ...(step === 2 && {
                        width: 900,
                        height: "auto",
                        overflow: "visible",
                    }),
                }}
            >
                <TwilioIntegLayout
                    formFields={formFields}
                    handleInput={(e) =>
                        handleInput(
                            e,
                            twilioConf,
                            setTwilioConf,
                            setIsLoading,
                            setSnackbar
                        )
                    }
                    twilioConf={twilioConf}
                    setTwilioConf={setTwilioConf}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setSnackbar={setSnackbar}
                />

                <button
                    onClick={() => nextPage(3)}
                    className="btn f-right btcd-btn-lg green sh-sm flx"
                    type="button"
                >
                    {__("Next", "bit-integrations")} &nbsp;
                    <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
                </button>
            </div>

            {/* STEP 3 */}
            <IntegrationStepThree
                step={step}
                saveConfig={() => saveConfig()}
            />
        </div>
    );
}

export default Twilio;
