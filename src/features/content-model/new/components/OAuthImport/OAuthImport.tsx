import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import * as z from 'zod';

import getContentfulOrganizations from '@/src/features/content-model/api/getContentfulOrganizations';
import getContentfulEnvironments from '@/src/features/content-model/api/getContentfulSpaceEnvironments';
import getContentfulSpaces from '@/src/features/content-model/api/getContentfulSpaces';
import { SpaceImportData } from '@/src/features/content-model/new/types/spaceImport';
import {
  contentfulEnvironmentSchema,
  contentfulEnvironmentsSchema,
} from '@/src/features/content-model/types/contentfulEnvironment';
import { contentfulOrganizationsSchema } from '@/src/features/content-model/types/contentfulOrganization';
import {
  contentfulSpaceSchema,
  contentfulSpacesSchema,
} from '@/src/features/content-model/types/contentfulSpace';
import updateUser from '@/src/features/user/api/updateUser';
import Button from '@/src/shared/components/Button/Button';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { useStore } from '@/store/hooks';

type OAuthImportData = Omit<SpaceImportData, 'token'>;

interface OAuthImport {
  oauthImportDetails: OAuthImportData;
  setOAuthImportDetails: React.Dispatch<React.SetStateAction<SpaceImportData>>;
  onChange: (value: string) => void;
  validateContentModel: (contentModelText: string) => void;
  viewError: string | null;
  setViewError: React.Dispatch<React.SetStateAction<string | null>>;
}

const OAuthImport: React.FC<OAuthImport> = observer((props) => {
  const {
    onChange,
    validateContentModel,
    viewError,
    setViewError,
    oauthImportDetails,
    setOAuthImportDetails,
  } = props;

  const store = useStore();

  const { register, handleSubmit, errors, watch } = useForm({
    defaultValues: oauthImportDetails,
  });

  const selectedSpaceId = watch('spaceId');

  const updateUserMutation = useMutation(updateUser, {
    onError: () => {
      setViewError(
        'Failed to remove a read-only Contentfu management token from your profile. Please try again or contact us at hello@contentmodel.io',
      );
    },
    onSuccess: (data) => {
      store.setMe(data.updateUser);
    },
  });

  const getContentfulSpacesQuery = useQuery(
    ['getContentfulSpaces', store.me?.contentful_token_read],
    () => {
      if (store.me === null || store.me.contentful_token_read === null) {
        return Promise.resolve({ items: [] });
      }

      return getContentfulSpaces({
        token: store.me.contentful_token_read,
      });
    },
    {
      enabled: !!store.me?.contentful_token_read,
    },
  );
  const getContentfulOrganizationsQuery = useQuery(
    ['getContentfulOrganizations', store.me?.contentful_token_read],
    () => {
      if (store.me === null || store.me.contentful_token_read === null) {
        return Promise.resolve({ items: [] });
      }

      return getContentfulOrganizations({
        token: store.me.contentful_token_read,
      });
    },
    {
      enabled: !!store.me?.contentful_token_read,
    },
  );
  const getContentfulEnvironmentsQuery = useQuery(
    [
      'getContentfulEnvironments',
      store.me?.contentful_token_read,
      selectedSpaceId,
    ],
    () => {
      if (store.me === null || store.me?.contentful_token_read === null) {
        return Promise.resolve({ items: [] });
      }

      return getContentfulEnvironments({
        token: store.me.contentful_token_read,
        spaceId: selectedSpaceId,
      });
    },
    {
      enabled: !!selectedSpaceId,
    },
  );

  const spacesGroupedByOrgs = useMemo<
    Record<string, z.infer<typeof contentfulSpaceSchema>[]>
  >(() => {
    const spacesGroupedByOrgsRecord: Record<
      string,
      z.infer<typeof contentfulSpaceSchema>[]
    > = {};

    if (
      getContentfulSpacesQuery.data === undefined ||
      getContentfulOrganizationsQuery.data === undefined
    ) {
      return spacesGroupedByOrgsRecord;
    }

    const organizationsParsed = contentfulOrganizationsSchema.safeParse(
      getContentfulOrganizationsQuery.data,
    );
    const spacesParsed = contentfulSpacesSchema.safeParse(
      getContentfulSpacesQuery.data,
    );

    if (
      organizationsParsed.success === false ||
      spacesParsed.success === false
    ) {
      setViewError(
        'It looks like the read-only token that we have stored for your account is no longer valid. Revoke the access by clicking "revoke access" above, and re-do the authentication.',
      );
      return spacesGroupedByOrgsRecord;
    }

    organizationsParsed.data.items.forEach((org) => {
      const spaces = spacesParsed.data.items.filter(
        (space) => space.sys.organization.sys.id === org.sys.id,
      );

      spacesGroupedByOrgsRecord[org.name] = spaces;
    });

    return spacesGroupedByOrgsRecord;
  }, [
    getContentfulSpacesQuery.data,
    getContentfulOrganizationsQuery.data,
    setViewError,
  ]);

  const spaceEnvironments = useMemo<
    z.infer<typeof contentfulEnvironmentSchema>[]
  >(() => {
    const environments: z.infer<typeof contentfulEnvironmentSchema>[] = [];

    if (getContentfulEnvironmentsQuery.data === undefined) {
      return environments;
    }

    const environmentsListParsed = contentfulEnvironmentsSchema.safeParse(
      getContentfulEnvironmentsQuery.data,
    );

    if (environmentsListParsed.success === false) {
      setViewError(
        'Something went wrong while we were fetching a list of the space environments.',
      );
      return environments;
    }

    environmentsListParsed.data.items.forEach((environment) => {
      environments.push(environment);
    });

    return environments;
  }, [getContentfulEnvironmentsQuery.data, setViewError]);

  const onSubmit = async (data: OAuthImportData) => {
    if (store.me === null || store.me.contentful_token_read === null) {
      setViewError(
        'This state should never happen. Let us know at hello@contentmodel.io',
      );
      return;
    }

    setOAuthImportDetails({
      spaceId: data.spaceId,
      token: '',
      environmentId: data.environmentId,
    });

    const response = await fetch(
      `https://api.contentful.com/spaces/${data.spaceId}/environments/${
        data.environmentId === '' ? 'master' : data.environmentId
      }/content_types?access_token=${store.me.contentful_token_read}`,
    );

    if (response.ok === false) {
      setViewError(
        'Could not fetch the content model from the API. Check that you have provided the correct details.',
      );
      return;
    }

    const responseBody = await response.text();

    onChange(responseBody);

    validateContentModel(responseBody);
  };

  return (
    <>
      {store.me?.contentful_token_read ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <p className="text-base lg:text-lg">
            You have granted ContentModel.io a read-only access to your
            Contentful account. You can always{' '}
            <button
              className="appearance-none text-red-700 font-medium focus:underline focus:outline-none focus:text-red-800"
              onClick={() => {
                if (store.me?.id === undefined) {
                  return;
                }

                updateUserMutation.mutate({
                  id: store.me.id,
                  contentful_token_read: null,
                });
              }}
            >
              revoke access
            </button>
            .
          </p>

          <label className="block mt-4">
            <p className="text-lg font-semibold">Space to import from</p>
            {Object.keys(spacesGroupedByOrgs).length > 0 ? (
              <select
                name="spaceId"
                ref={register({ required: true })}
                className="mt-2 rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
              >
                <option value="">Select a space</option>
                {Object.keys(spacesGroupedByOrgs).map((orgName) => (
                  <optgroup key={orgName} label={orgName}>
                    {spacesGroupedByOrgs[orgName].map((space) => (
                      <option key={space.sys.id} value={space.sys.id}>
                        {space.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <p className="text-base">
                Fetching a list of spaces you have access to
              </p>
            )}
          </label>
          {errors.spaceId ? (
            <p className="mt-2 text-sm text-red-700">Space ID is required</p>
          ) : null}

          <label className="block mt-4">
            <p className="text-lg font-semibold">Environment (optional)</p>
            {getContentfulEnvironmentsQuery.data === undefined ? (
              getContentfulEnvironmentsQuery.isLoading ? (
                <p className="text-base">Loading the list of environments...</p>
              ) : (
                <p className="text-base">Select a space first</p>
              )
            ) : (
              <select
                name="environmentId"
                ref={register()}
                className="mt-2 rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
              >
                <option value="">Select an environment</option>
                {spaceEnvironments.map((environment) => (
                  <option key={environment.sys.id} value={environment.sys.id}>
                    {environment.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          {viewError !== null ? (
            <p className="mt-4 text-base text-red-700">{viewError}</p>
          ) : null}
          <footer className="mt-8 flex justify-end">
            <Button color="primary" type="submit">
              Import content model
            </Button>
          </footer>
        </form>
      ) : (
        <div className="mt-8">
          <p className="text-base lg:text-lg">
            Click on the button below to connect your Contentful account with
            ContentModel.io - this will give ContentModel.io a read-only access
            to your Contentful spaces
          </p>
          <a
            href={`https://be.contentful.com/oauth/authorize?response_type=token&client_id=${process.env.NEXT_PUBLIC_CONTENTFUL_OAUTH_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_CONTENTFUL_OAUTH_REDIRECT_URI}&scope=content_management_read`}
            className={getButtonClassName({
              color: 'primary',
              className: 'mt-4',
            })}
          >
            Authenticate with Contentful
          </a>
        </div>
      )}
    </>
  );
});

export default OAuthImport;
