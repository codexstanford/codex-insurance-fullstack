import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserDataset } from "../api/userDataset";
import Container from "../components/Container";
import Heading from "../components/Heading";
import InlineForm from "../components/InlineForm";
import Input from "../components/Input";
import InputDate from "../components/InputDate";
import { COMMON_BORDER_CLASSES } from "../consts/classes.const";
import { LoginContext } from "../contexts/loginContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { classNames } from "../utils/classNames";
import {
  dateToString,
  getFirstOrNextId,
  removeEscapedDoubleQoutes,
  stringToDate,
} from "../utils/epilogUtils";
import InputSelect from "../components/InputSelect";
import { BasicOption } from "../types/basicOption";
import { YES_OR_NO } from "../consts/options.const";
import { Button, ButtonLink } from "../components/Button";
import { ROUTES } from "common";

const borderClassNames = classNames(
  COMMON_BORDER_CLASSES,
  "rounded-2xl border-gray-100 divide-y [&>*]:p-3",
);

export default function Profile() {
  const sessionUser = useContext(LoginContext);
  const userDataset = useContext(UserDatasetContext);

  if (!sessionUser || !userDataset)
    throw new Error("LoginContext or UserDatasetContext not found");

  const personId = getFirstOrNextId("person", userDataset);
  const { mutation } = useUserDataset(sessionUser.id);

  return (
    <>
      <Container
        makeBoxed="narrow"
        addVerticalPadding={true}
        makeGutter={true}
        className="gap-10"
      >
        <Container
          makeGutter={true}
          className="gap-10 lg:flex-row lg:[&>*]:flex-1 lg:items-start"
        >
          <Container makeGutter={true} className={borderClassNames}>
            <Container makeGutter={true}>
              <Heading level={2}>Your Profile</Heading>
              <p className="text-gray-600">
                This is the main profile associated with this account that will
                be selected by default when considering coverage. You can
                examine coverage for other individuals by adding a new person.
              </p>
            </Container>
            <PersonInput
              subPredicate="firstName"
              label="Legal First Name"
              personId={personId}
              userDataset={userDataset}
              mutation={mutation}
            />
            <PersonInput
              subPredicate="lastName"
              label="Legal Last Name"
              personId={personId}
              userDataset={userDataset}
              mutation={mutation}
            />
            <PersonInput
              subPredicate="dob"
              label="Date of Birth"
              personId={personId}
              userDataset={userDataset}
              mutation={mutation}
              type="date"
            />
            <PersonInput
              subPredicate="immunocompromised"
              label="Immunocompromised Status"
              personId={personId}
              userDataset={userDataset}
              mutation={mutation}
              type="yesOrNo"
            />
          </Container>
          <Container makeGutter={true} className={borderClassNames}>
            <Container makeGutter={true}>
              <Heading level={2}>Account Settings</Heading>
            </Container>
            <Container makeGutter={true} className="flex-row">
              <Container makeGutter={true} className="flex-1 gap-1">
                <label>Email</label>
                <p className="text-gray-600">
                  {sessionUser.email || "Undefined"}
                </p>
              </Container>
              <div className="flex items-center">
                <Button disabled={true}>Update</Button>
              </div>
            </Container>
          </Container>
        </Container>
        <div className="flex flex-col items-end">
          <ButtonLink
            href={ROUTES.API_AUTH_LOGOUT}
            renderAsReactRouterLink={false}
            color="gray"
          >
            Logout
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Inline forms                                */
/* -------------------------------------------------------------------------- */

type InlineFormProps = {
  subPredicate: string;
  label: string;
  personId: string;
  userDataset: ReturnType<typeof definemorefacts>;
  mutation: ReturnType<typeof useUserDataset>["mutation"];
  type?: "text" | "date" | "yesOrNo";
};

function PersonInput({
  subPredicate,
  label,
  personId,
  userDataset,
  mutation,
  type = "text",
}: InlineFormProps) {
  const [inputValue, setInputValue] = useState("");

  const datasetValue = useMemo(() => {
    let [datasetValue] = compfinds(
      "X",
      read(`person.${subPredicate}(${personId}, X)`),
      userDataset,
      [],
    ) as string[];

    if (datasetValue) datasetValue = removeEscapedDoubleQoutes(datasetValue);
    if (!datasetValue) datasetValue = "Undefined";

    return datasetValue;
  }, [subPredicate, personId, userDataset]);

  const datasetValueAsDate = useMemo(
    () => (type === "date" ? stringToDate(datasetValue) : new Date()),
    [datasetValue],
  );

  useEffect(() => setInputValue(datasetValue), [datasetValue]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value),
    [setInputValue],
  );

  const onChangeSelect = useCallback(
    (option: BasicOption | BasicOption[] | null) =>
      setInputValue((option as BasicOption).id + ""),
    [setInputValue],
  );

  const onChangeDate = useCallback(
    (date: Date) => setInputValue(dateToString(date)),
    [setInputValue],
  );

  const onSubmit = useCallback(
    () =>
      mutation.mutateAsync(
        definemorefacts(
          readdata(`person.${subPredicate}(${personId}, "${inputValue}")`),
          userDataset,
        ),
      ),
    [subPredicate, mutation, personId, inputValue, userDataset],
  );

  if (type === "yesOrNo")
    return (
      <>
        <InlineForm
          label={label}
          valueStringRepresentation={
            YES_OR_NO.find((option) => option.id === inputValue)?.label ||
            "Undefined"
          }
          onSubmit={onSubmit}
        >
          <InputSelect
            options={YES_OR_NO}
            value={YES_OR_NO.find((option) => option.id === inputValue) || null}
            onChange={onChangeSelect}
          />
        </InlineForm>
      </>
    );

  if (type === "date")
    return (
      <>
        <InlineForm
          label={label}
          valueStringRepresentation={datasetValueAsDate.toLocaleDateString()}
          onSubmit={onSubmit}
        >
          <InputDate value={datasetValueAsDate} onChange={onChangeDate} />
        </InlineForm>
      </>
    );

  return (
    <>
      <InlineForm
        label={label}
        valueStringRepresentation={datasetValue}
        onSubmit={onSubmit}
      >
        <Input type="text" value={inputValue} onChange={onChange} />
      </InlineForm>
    </>
  );
}
